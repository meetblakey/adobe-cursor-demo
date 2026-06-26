#!/usr/bin/env bash
# Deterministic migration scaffolder — same shape every time, so the agent doesn't guess the
# next sequence number or the file header. Usage: new-migration.sh <slug>
set -euo pipefail
slug="${1:?usage: new-migration.sh <slug>}"
dir="supabase/migrations"
mkdir -p "$dir"
# next zero-padded sequence from existing NNNN_*.sql (ponytail: simple max+1, fine for a demo)
last="$(ls "$dir"/[0-9]*_*.sql 2>/dev/null | sed -E 's#.*/([0-9]+)_.*#\1#' | sort -n | tail -1)"
next="$(printf '%04d' "$(( 10#${last:-0} + 1 ))")"
file="$dir/${next}_${slug}.sql"
printf -- '-- %s\n-- (write the up SQL below; extend RLS for any new table/column)\n\n' "$slug" > "$file"
echo "$file"
