#!/usr/bin/env bash
# Localize achievement card thumbnails.
#
# achievements.html currently hotlinks preview images from their source sites
# (with a built-in gradient/icon fallback if any image ever dies). Run this
# once to download local copies into assets/achievements/ and rewrite the
# page to use them — after that the previews can never break.
#
# Usage (from the repo root):  bash tools/localize-thumbnails.sh
set -u
cd "$(dirname "$0")/.."
mkdir -p assets/achievements
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

localize() {
  url="$1"
  out="$2"
  if curl -fsSL --max-time 30 -A "$UA" -o "$out" "$url"; then
    echo "downloaded  $out"
    # Swap the remote URL for the local copy (BSD sed first, GNU fallback)
    sed -i '' -e "s|$url|$out|g" achievements.html 2>/dev/null ||
      sed -i -e "s|$url|$out|g" achievements.html
  else
    echo "FAILED      $url (kept remote URL in page)"
    rm -f "$out"
  fi
}

localize "https://img.youtube.com/vi/bJ_U2_9Ig7g/hqdefault.jpg" "assets/achievements/chatpt-demo.jpg"
localize "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/484/268/datas/medium.jpg" "assets/achievements/visual-tales.jpg"
localize "https://wearecollegetennis.com/wp-content/uploads/2022/11/JUCO-Mens-Rankings-Website-Graphic-scaled.jpg" "assets/achievements/ita-juco-rankings.jpg"
localize "https://kubrick.htvapps.com/vidthumb/36fcabe6-9894-4b7e-aca9-469e5a359400/36fcabe6-9894-4b7e-aca9-469e5a359400_image.jpg" "assets/achievements/kcra-interview.jpg"

echo "Done. Review with 'git diff achievements.html' before committing."
