#!/usr/bin/env bash
# Download the twg binary and install skills.
#
# Public installer usage:
#   bash <(curl -fsSL https://teamwork-graph.atlassian.com/cli/install)
#   bash <(curl -fsSL https://teamwork-graph.atlassian.com/cli/install) --version 0.3.2
#   bash <(curl -fsSL https://teamwork-graph.atlassian.com/cli/install) --skip-login
#   bash <(curl -fsSL https://teamwork-graph.atlassian.com/cli/install) --skip-skills
#
# Environment variables:
#   TWG_VERSION=0.5.0   Alternative to --version flag (e.g. for scripted installs)
set -euo pipefail

INSTALLER_MODE="${TWG_INSTALLER_MODE:-public}"
PUBLIC_CDN_BASE_URL="${TWG_INSTALL_BASE_URL:-https://teamwork-graph.atlassian.com/cli}"
STATLAS_BASE_URL="${TWG_INSTALL_BASE_URL:-https://statlas.prod.atl-paas.net/community-assets-twg/clis}"
AGENT_INSTRUCTIONS_URL="${PUBLIC_CDN_BASE_URL}/AGENTS.md"
DEFAULT_VERSION="1.0.18"

case "${INSTALLER_MODE}" in
  public|statlas) ;;
  *)
    echo "Error: unsupported installer mode '${INSTALLER_MODE}'." >&2
    exit 2
    ;;
esac

# ---------------------------------------------------------------------------
# Parse flags
# ---------------------------------------------------------------------------
SKIP_DOWNLOAD=false
SKIP_LOGIN=false
SKIP_SKILLS=false
WAIT_FOR_PID=""
INSTALL_DIR_OVERRIDE=""
REQUESTED_VERSION="${TWG_VERSION:-}"
GLOBAL_INSTALL=true
ASSUME_YES=false
INSTALLER_USE_PAT="${TWG_INSTALLER_PAT:-0}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --global)
      GLOBAL_INSTALL=true
      shift
      ;;
    --local)
      GLOBAL_INSTALL=false
      shift
      ;;
    --skip-download)
      SKIP_DOWNLOAD=true
      shift
      ;;
    -y|--yes)
      if [[ "${INSTALLER_MODE}" == "statlas" ]]; then
        ASSUME_YES=true
      fi
      shift
      ;;
    --skip-login)
      SKIP_LOGIN=true
      shift
      ;;
    --skip-skills)
      SKIP_SKILLS=true
      shift
      ;;
    --pat)
      INSTALLER_USE_PAT=1
      shift
      ;;
    --wait-for-pid)
      if [[ $# -lt 2 ]]; then
        echo "Error: --wait-for-pid requires a value." >&2
        exit 2
      fi
      WAIT_FOR_PID="$2"
      shift 2
      ;;
    --wait-for-pid=*)
      WAIT_FOR_PID="${1#--wait-for-pid=}"
      shift
      ;;
    --install-dir)
      if [[ $# -lt 2 ]]; then
        echo "Error: --install-dir requires a value." >&2
        exit 2
      fi
      INSTALL_DIR_OVERRIDE="$2"
      shift 2
      ;;
    --install-dir=*)
      INSTALL_DIR_OVERRIDE="${1#--install-dir=}"
      if [[ -z "${INSTALL_DIR_OVERRIDE}" ]]; then
        echo "Error: --install-dir requires a value." >&2
        exit 2
      fi
      shift
      ;;
    --version)
      if [[ $# -lt 2 ]]; then
        echo "Error: --version requires a value." >&2
        exit 2
      fi
      REQUESTED_VERSION="$2"
      shift 2
      ;;
    --version=*)
      REQUESTED_VERSION="${1#--version=}"
      shift
      ;;
    *)
      echo "Error: unknown argument '$1'." >&2
      exit 2
      ;;
  esac
done

# ---------------------------------------------------------------------------
# Detect platform
# ---------------------------------------------------------------------------
OS="$(uname -s)"
ARCH="$(uname -m)"

case "${OS}" in
  Darwin) PLATFORM="darwin" ;;
  Linux)  PLATFORM="linux"  ;;
  *)
    echo "Error: unsupported OS '${OS}'. Only macOS and Linux are supported." >&2
    exit 1
    ;;
esac

case "${ARCH}" in
  arm64|aarch64) ARCH_SUFFIX="arm64" ;;
  x86_64)        ARCH_SUFFIX="x64"   ;;
  *)
    echo "Error: unsupported architecture '${ARCH}'. Only arm64 and x86_64 are supported." >&2
    exit 1
    ;;
esac

BINARY_NAME="twg-${PLATFORM}-${ARCH_SUFFIX}"

if [[ "${INSTALLER_MODE}" == "statlas" ]]; then
  if [[ -n "${REQUESTED_VERSION}" ]]; then
    DOWNLOAD_BASE_URL="${STATLAS_BASE_URL}/${REQUESTED_VERSION}"
    RELEASE_SELECTOR="version ${REQUESTED_VERSION}"
    INSTALLED_VERSION_LABEL="${REQUESTED_VERSION}"
  else
    DOWNLOAD_BASE_URL="${STATLAS_BASE_URL}/stable"
    RELEASE_SELECTOR="stable"
    INSTALLED_VERSION_LABEL="stable"
  fi
  DOWNLOAD_BINARY_NAME="${BINARY_NAME}"
  CHECKSUMS_URL="${DOWNLOAD_BASE_URL}/SHA256SUMS"
  FINALIZE_SOURCE="release-setup"
  FINALIZE_SKILLS_SCOPE="global"
  if [[ -n "${INSTALL_DIR_OVERRIDE}" ]]; then
    INSTALL_DIR="${INSTALL_DIR_OVERRIDE}"
  elif [[ "${GLOBAL_INSTALL}" == "true" ]]; then
    INSTALL_DIR="${HOME}/.local/bin"
  else
    INSTALL_DIR="$(pwd)/bin"
  fi
else
  if [[ -n "${REQUESTED_VERSION}" ]]; then
    RELEASE_SELECTOR="version ${REQUESTED_VERSION}"
  else
    REQUESTED_VERSION="${DEFAULT_VERSION}"
    RELEASE_SELECTOR="latest (v${DEFAULT_VERSION})"
  fi
  INSTALLED_VERSION_LABEL="${REQUESTED_VERSION}"
  DOWNLOAD_BINARY_NAME="${BINARY_NAME}-v${REQUESTED_VERSION}"
  DOWNLOAD_BASE_URL="${PUBLIC_CDN_BASE_URL}"
  CHECKSUMS_URL="${PUBLIC_CDN_BASE_URL}/SHA256SUMS-v${REQUESTED_VERSION}"
  FINALIZE_SOURCE="direct-public-installer"
  FINALIZE_SKILLS_SCOPE="global"
  INSTALL_DIR="${INSTALL_DIR_OVERRIDE:-${HOME}/.local/bin}"

  echo "Agent install instructions: ${AGENT_INSTRUCTIONS_URL}"
fi

TWG_PATH="${INSTALL_DIR}/twg"
TWG_BIN_PATH="${INSTALL_DIR}/twg-bin"

detect_shell_profile() {
  case "${SHELL:-}" in
    */zsh) echo "${HOME}/.zshrc" ;;
    */bash)
      if [[ -f "${HOME}/.bash_profile" ]]; then
        echo "${HOME}/.bash_profile"
      else
        echo "${HOME}/.bashrc"
      fi
      ;;
    *) echo "${HOME}/.zshrc" ;;
  esac
}

append_install_dir_to_path_profile() {
  SHELL_PROFILE="$(detect_shell_profile)"
  PATH_PROFILE_UPDATED=false
  PATH_PROFILE_SKIPPED=false
  local confirm_path=""


  if [[ -f "${SHELL_PROFILE}" ]] && grep -F "export PATH=\"${INSTALL_DIR}:\$PATH\"" "${SHELL_PROFILE}" >/dev/null 2>&1; then
    PATH_PROFILE_UPDATED=true
    return
  fi

  if {
    printf '\n'
    printf '# Added by Teamwork Graph CLI installer\n'
    printf 'export PATH="%s:$PATH"\n' "${INSTALL_DIR}"
  } >> "${SHELL_PROFILE}"; then
    PATH_PROFILE_UPDATED=true
  else
    PATH_PROFILE_SKIPPED=true
    echo "Warning: could not update ${SHELL_PROFILE}; continuing without a persistent PATH update." >&2
  fi
}

# ---------------------------------------------------------------------------
# Pre-flight: ensure curl is available when downloading
# ---------------------------------------------------------------------------
if [[ "${SKIP_DOWNLOAD}" != "true" ]] && ! command -v curl &>/dev/null; then
  echo "Error: 'curl' not found on PATH." >&2
  exit 127
fi

# ---------------------------------------------------------------------------
# Confirm installation
# ---------------------------------------------------------------------------
echo "Detected platform: ${PLATFORM}-${ARCH_SUFFIX}"
echo "Requested release: ${RELEASE_SELECTOR}"
echo "Will install twg to: ${TWG_PATH}"
echo ""
if [[ "${SKIP_DOWNLOAD}" == "true" ]]; then
  echo "Will reuse existing twg at: ${TWG_PATH}"
  echo ""
fi

# ---------------------------------------------------------------------------
# Download binary or reuse an existing one for local testing
# ---------------------------------------------------------------------------
mkdir -p "${INSTALL_DIR}"

if [[ -n "${WAIT_FOR_PID}" ]]; then
  while kill -0 "${WAIT_FOR_PID}" 2>/dev/null; do
    sleep 1
  done
fi

TWG_BACKUP=""
TWG_LEGACY_COPIED=false
TWG_INSTALLED_REPLACEMENT=false
INSTALL_METADATA_PATH=""
INSTALL_METADATA_BACKUP=""
INSTALL_METADATA_ROLLBACK_ACTION="none"

run_without_bun_env() (
  for name in "${!BUN_@}"; do
    unset "${name}"
  done
  "$@"
)

validate_setup_finalize_support() {
  local candidate_path="$1"
  if run_without_bun_env "${candidate_path}" setup finalize --help >/dev/null 2>&1; then
    return 0
  fi
  echo "Error: downloaded twg ${INSTALLED_VERSION_LABEL} does not support 'twg setup finalize'." >&2
  echo "Install twg v0.9.2 or newer, or use an installer published with that older release." >&2
  return 1
}

backup_existing_twg() {
  if [[ -e "${TWG_PATH}" ]]; then
    TWG_BACKUP="$(mktemp "${INSTALL_DIR}/.twg.backup.XXXXXX")" || {
      echo "Error: could not create backup file in ${INSTALL_DIR}." >&2
      exit 1
    }
    mv "${TWG_PATH}" "${TWG_BACKUP}"
  fi
}

rollback_twg_install() {
  local status="$1"
  if [[ -n "${TWG_BACKUP}" && -e "${TWG_BACKUP}" ]]; then
    rm -f "${TWG_PATH}" 2>/dev/null || true
    mv "${TWG_BACKUP}" "${TWG_PATH}" 2>/dev/null || true
  elif [[ "${TWG_LEGACY_COPIED}" == "true" || "${TWG_INSTALLED_REPLACEMENT}" == "true" ]]; then
    rm -f "${TWG_PATH}" 2>/dev/null || true
  fi
  restore_install_metadata
  exit "${status}"
}

cleanup_replaced_twg_files() {
  rm -f "${TWG_BIN_PATH}" 2>/dev/null || true
  if [[ -n "${TWG_BACKUP}" ]]; then
    rm -f "${TWG_BACKUP}" 2>/dev/null || true
  fi
  if [[ -n "${INSTALL_METADATA_BACKUP}" ]]; then
    rm -f "${INSTALL_METADATA_BACKUP}" 2>/dev/null || true
  fi
}

resolve_install_metadata_path() {
  local config_root
  if [[ -n "${TWG_CONFIG_DIR:-}" ]]; then
    config_root="${TWG_CONFIG_DIR}"
  elif [[ -n "${XDG_CONFIG_HOME:-}" ]]; then
    config_root="${XDG_CONFIG_HOME}/twg"
  else
    config_root="${HOME}/.config/twg"
  fi
  printf '%s/install.json\n' "${config_root}"
}

backup_install_metadata() {
  INSTALL_METADATA_PATH="$(resolve_install_metadata_path)"
  if [[ -e "${INSTALL_METADATA_PATH}" ]]; then
    local metadata_backup
    metadata_backup="$(mktemp "${TMPDIR:-/tmp}/twg-install-metadata.XXXXXX")" || {
      echo "Error: could not create install metadata backup." >&2
      return 1
    }
    cp "${INSTALL_METADATA_PATH}" "${metadata_backup}" || {
      rm -f "${metadata_backup}" 2>/dev/null || true
      return 1
    }
    INSTALL_METADATA_BACKUP="${metadata_backup}"
    INSTALL_METADATA_ROLLBACK_ACTION="restore"
  else
    INSTALL_METADATA_ROLLBACK_ACTION="remove"
  fi
}

restore_install_metadata() {
  if [[ -z "${INSTALL_METADATA_PATH}" ]]; then
    return
  fi
  case "${INSTALL_METADATA_ROLLBACK_ACTION}" in
    restore)
      if [[ -n "${INSTALL_METADATA_BACKUP}" && -e "${INSTALL_METADATA_BACKUP}" ]]; then
        mkdir -p "$(dirname "${INSTALL_METADATA_PATH}")" 2>/dev/null || true
        cp "${INSTALL_METADATA_BACKUP}" "${INSTALL_METADATA_PATH}" 2>/dev/null || true
      fi
      ;;
    remove)
      rm -f "${INSTALL_METADATA_PATH}" 2>/dev/null || true
      ;;
    none) ;;
  esac
}

if [[ "${SKIP_DOWNLOAD}" == "true" ]]; then
  if [[ ! -x "${TWG_PATH}" && -x "${TWG_BIN_PATH}" ]]; then
    cp "${TWG_BIN_PATH}" "${TWG_PATH}"
    chmod +x "${TWG_PATH}"
    TWG_LEGACY_COPIED=true
  fi
  if [[ ! -x "${TWG_PATH}" ]]; then
    echo "Error: --skip-download requires an existing executable at ${TWG_PATH}." >&2
    exit 126
  fi
  echo "Skipping download and reusing existing twg at ${TWG_PATH}"
else
  URL="${DOWNLOAD_BASE_URL}/${DOWNLOAD_BINARY_NAME}"
  CHECKSUMS_PATH="$(mktemp "${TMPDIR:-/tmp}/twg-sha256sums.XXXXXX")"
  TWG_TMP=""
  trap 'rm -f "${CHECKSUMS_PATH}" "${TWG_TMP}"' EXIT
  rm -f "${INSTALL_DIR}"/.twg.* 2>/dev/null || true
  TWG_TMP="$(mktemp "${INSTALL_DIR}/.twg.XXXXXX")" || {
    echo "Error: could not create temporary file in ${INSTALL_DIR}. Check disk space and permissions." >&2
    exit 1
  }
  echo "Downloading ${URL} …"
  curl -fSL --retry 2 -o "${TWG_TMP}" "${URL}"
  echo "Downloading ${CHECKSUMS_URL} -> ${CHECKSUMS_PATH} …"
  curl -fSL --retry 2 -o "${CHECKSUMS_PATH}" "${CHECKSUMS_URL}"

  if [[ ! -s "${CHECKSUMS_PATH}" ]]; then
    echo "Error: checksum file is empty or download failed. Aborting." >&2
    exit 1
  fi

  expected_sha="$(awk -v file="${DOWNLOAD_BINARY_NAME}" '{
    checksum = $1
    name = $2
    sub(/^\*/, "", name)
    sub(/\r$/, "", name)
    if (name == file) { print checksum; exit }
  }' "${CHECKSUMS_PATH}")"
  if [[ -z "${expected_sha}" ]]; then
    echo "Error: checksum entry for ${DOWNLOAD_BINARY_NAME} not found in ${CHECKSUMS_URL}." >&2
    exit 1
  fi

  if command -v sha256sum &>/dev/null; then
    actual_sha="$(sha256sum "${TWG_TMP}" | awk '{print $1}')"
  elif command -v shasum &>/dev/null; then
    actual_sha="$(shasum -a 256 "${TWG_TMP}" | awk '{print $1}')"
  else
    echo "Error: neither sha256sum nor shasum is available to verify ${DOWNLOAD_BINARY_NAME}." >&2
    exit 127
  fi

  if [[ "${actual_sha}" != "${expected_sha}" ]]; then
    echo "Error: checksum verification failed for ${DOWNLOAD_BINARY_NAME}." >&2
    echo "Expected: ${expected_sha}" >&2
    echo "Actual:   ${actual_sha}" >&2
    exit 1
  fi

  chmod +x "${TWG_TMP}"
  if [ ! -x "${TWG_TMP}" ]; then
    echo "Error: could not make downloaded binary executable." >&2
    exit 126
  fi
  validate_setup_finalize_support "${TWG_TMP}"
  backup_existing_twg
  mv "${TWG_TMP}" "${TWG_PATH}" || {
    move_status=$?
    rollback_twg_install "${move_status}"
  }
  TWG_INSTALLED_REPLACEMENT=true
  TWG_TMP=""

  if [[ "${OS}" == "Darwin" ]]; then
    xattr -d com.apple.quarantine "${TWG_PATH}" 2>/dev/null || true
  fi
fi

echo ""

# ---------------------------------------------------------------------------
# Ensure install dir is on PATH
# ---------------------------------------------------------------------------
PATH_ALREADY_SET=true
PATH_PROFILE_UPDATED=false
PATH_PROFILE_SKIPPED=false
SHELL_PROFILE=""
case ":${PATH}:" in
  *":${INSTALL_DIR}:"*) ;;
  *)
    PATH_ALREADY_SET=false
    export PATH="${INSTALL_DIR}:${PATH}"
    append_install_dir_to_path_profile
    ;;
esac

run_setup_finalize() {
  local finalize_args
  finalize_args=(
    setup finalize
    --install-method direct-public-installer
    --install-channel stable
    --install-dir "${INSTALL_DIR}"
    --binary-path "${TWG_PATH}"
    --installed-version "${INSTALLED_VERSION_LABEL}"
    --platform "${PLATFORM}"
    --arch "${ARCH_SUFFIX}"
    --source "${FINALIZE_SOURCE}"
    --skills-scope "${FINALIZE_SKILLS_SCOPE}"
  )
  finalize_args+=(--detect-agents --allow-login-failure)
  if [[ "${INSTALLER_USE_PAT}" == "1" ]]; then
    finalize_args+=(--pat --from-clipboard)
  fi
  if [[ "${SKIP_SKILLS}" == "true" ]]; then
    finalize_args+=(--skip-skills)
  fi
  if [[ "${SKIP_LOGIN}" == "true" ]]; then
    finalize_args+=(--skip-login)
  fi

  if validate_setup_finalize_support "${TWG_PATH}"; then
    local finalize_status
    run_without_bun_env "${TWG_PATH}" "${finalize_args[@]}"
    finalize_status=$?
    if [[ "${finalize_status}" -eq 20 ]]; then
      LOGIN_FAILED=true
    elif [[ "${finalize_status}" -ne 0 ]]; then
      return "${finalize_status}"
    fi
  else
    return 1
  fi
}

# ---------------------------------------------------------------------------
# Record install metadata, consent, skills, help cache and login
# ---------------------------------------------------------------------------
LOGIN_FAILED=false
if ! backup_install_metadata; then
  rollback_twg_install 1
fi
set +e
run_setup_finalize
finalize_result=$?
set -e
if [[ "${finalize_result}" -ne 0 ]]; then
  rollback_twg_install "${finalize_result}"
fi
cleanup_replaced_twg_files
echo "twg ${INSTALLED_VERSION_LABEL} installed at ${TWG_PATH}"

# ---------------------------------------------------------------------------
# Final summary — always shown last
# ---------------------------------------------------------------------------
echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ Installed: ${TWG_PATH}"
echo ""
if [[ "${PATH_ALREADY_SET}" == "false" ]]; then
  if [[ "${PATH_PROFILE_UPDATED}" == "true" ]]; then
    echo "  ✅ Added ${INSTALL_DIR} to ${SHELL_PROFILE}"
    echo "  Open a new terminal to pick up the PATH update."
  elif [[ "${PATH_PROFILE_SKIPPED}" == "true" ]]; then
    echo "  ⚠️  ${INSTALL_DIR} was not added to your shell profile."
    echo "  twg is available inside this installer process only until your PATH is updated."
  fi
else
  echo "  ✅ ${INSTALL_DIR} is already in your PATH — you're all set!"
fi
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  twg doctor"
if [[ "${SKIP_LOGIN}" == "true" || "${LOGIN_FAILED}" == "true" ]]; then
  echo "  twg login                      # (skipped during install)"
fi
if [[ "${SKIP_SKILLS}" == "true" ]]; then
  echo "  twg skills install -g          # (skipped during install)"
fi
