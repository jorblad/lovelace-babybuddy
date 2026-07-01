BabyBuddy custom Lovelace cards
================================

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz)
[![GitHub Release](https://img.shields.io/github/v/release/jorblad/lovelace-babybuddy)](https://github.com/jorblad/lovelace-babybuddy/releases)
[![License](https://img.shields.io/github/license/jorblad/lovelace-babybuddy)](LICENSE)

![Overview](https://github.com/jorblad/lovelace-babybuddy/blob/da59f83e9270a1c0c9ef390b0f12364c47a72e85/docs/images/overview.png)

This folder contains aomw small custom Lovelace cards that plot the time-series attributes produced by babybuddy rest-sensors.

- `babybuddy-growth-card.js` — line charts for growth metrics (weight, height, head circumference).
- `babybuddy-timeline-card.js` — timeline scatter chart for feedings and diaper events (wet/solid).
- `babybuddy-feedings-card.js` — card that shows comparison between feeding-types over a number of days.
- `babybuddy-add-diaper-card.js` — popup form card for logging diaper changes to the babybuddy integration.
- `babybuddy-add-feeding-card.js` — popup form card for logging feedings to the babybuddy integration.
- `babybuddy-overview-card.js` — overview card displaying recent diaper changes or feedings with tags and timestamps.

---

## 🧩 Installation (HACS)

1. Open **HACS**
2. Go to **Frontend**
3. Click **Custom repositories**
4. Add this repository:
   - **Repository**: `https://github.com/jorblad/lovelace-babybuddy`
   - **Category**: `Lovelace`
5. Install the repository
6. Restart Home Assistant or refresh the browser cache

---

Installation manual

1. Copy the `www/custom_cards` folder into your Home Assistant `/config/www` folder. The files should be reachable under `/local/custom_cards/...`.

2. Add the local card JS files as resources in Lovelace (Configuration -> Lovelace Dashboards -> Resources -> Add) or in your raw Lovelace config:

```yaml
resources:
  - url: /local/custom_cards/babybuddy-growth-card.js
    type: module
  - url: /local/custom_cards/babybuddy-timeline-card.js
    type: module
  - url: /local/custom_cards/babybuddy-feedings-card.js
    type: module
  - url: /local/custom_cards/babybuddy-add-diaper-card.js
    type: module
  - url: /local/custom_cards/babybuddy-add-feeding-card.js
    type: module
  - url: /local/custom_cards/babybuddy-overview-card.js
    type: module
```

3. The cards depend on ApexCharts which is loaded from CDN by the cards automatically. If you prefer to self-host ApexCharts, add it as a resource before the cards.

## Usage examples

### Growth card

```yaml
type: 'custom:babybuddy-growth-card'
entities:
  - sensor.babybuddy_latest_weight
  - sensor.babybuddy_latest_height
  - sensor.babybuddy_latest_head_circumference
chart_type: line
height: 360
debug: false
disable_scroll_zoom: true
graph_unit: cm
block_touch_zoom: false
```

### Timeline card

```yaml
type: 'custom:babybuddy-timeline-card'
feedings_entity: sensor.babybuddy_recent_feedings_count
diaper_entity: sensor.babybuddy_last_diaper_time
height: 320
```

Advanced options

- `feed_labels`: map method keys to display labels. Example:

```yaml
type: 'custom:babybuddy-timeline-card'
feedings_entity: sensor.babybuddy_recent_feedings_count
diaper_entity: sensor.babybuddy_last_diaper_time
feed_labels:
  left: Left breast
  right: Right breast
  bottle: Bottle
  solid_food: Solid food
  other: Parent-fed
```

- `feed_colors`: map method keys to colors (hex). Example:

```yaml
feed_colors:
  left: '#1f77b4'
  right: '#ff7f0e'
  bottle: '#2ca02c'
  solid_food: '#9467bd'
  other: '#7f7f7f'
```

### Add Diaper Card

A popup form card for quickly logging diaper changes to the babybuddy integration.

**Requirements:**
- [BabyBuddy integration](https://github.com/jcgoette/babybuddy) must be installed from HACS

**Basic usage:**

```yaml
type: custom:babybuddy-add-diaper-card
device_id: YOUR_BABYBUDDY_DEVICE_ID
```

**Configuration options:**

```yaml
type: custom:babybuddy-add-diaper-card
device_id: YOUR_BABYBUDDY_DEVICE_ID
title: 'Log Diaper Change'
button_text: 'Log Diaper'

# Defaults
default_type: Wet  # Wet, Solid, Wet and Solid, or Dry
default_color: Black  # Black, Brown, Green, Yellow
default_amount: 1

# Optional fields
show_amount: false  # Show amount selector
show_notes: false  # Show notes field
show_color: false  # Show color selector

# Tags for quick selection
tags:
  - tag1
  - tag2
```

**Diaper types:**
- Wet
- Solid
- Wet and Solid
- Dry

### Add Feeding Card

A popup form card for quickly logging feedings to the babybuddy integration.

**Requirements:**
- [BabyBuddy integration](https://github.com/jcgoette/babybuddy) must be installed from HACS

**Basic usage:**

```yaml
type: custom:babybuddy-add-feeding-card
device_id: YOUR_BABYBUDDY_DEVICE_ID
```

**Configuration options:**

```yaml
type: custom:babybuddy-add-feeding-card
device_id: YOUR_BABYBUDDY_DEVICE_ID
title: 'Log Feeding'
button_text: 'Log Feeding'

# Defaults
default_type: Breast milk  # Breast milk, Formula, Fortified breast milk, Solid food
default_method: Bottle  # Bottle, Left breast, Right breast, Both breasts, Parent fed, Self fed
default_duration: 10  # Duration in minutes (1-120)
default_amount: 1

# Optional fields
show_amount: false  # Show amount field
show_notes: false  # Show notes field

# Tags for quick selection
tags:
  - tag1
  - tag2
```

**Feeding types:**
- Breast milk
- Formula
- Fortified breast milk
- Solid food

**Feeding methods:**
- Bottle
- Left breast
- Right breast
- Both breasts
- Parent fed
- Self fed

### Overview Card

A card that displays recent diaper changes or feedings in a list format with timestamps, tags, and event details.

**Requirements:**
- [BabyBuddy integration](https://github.com/jcgoette/babybuddy) must be installed from HACS

**Basic usage:**

```yaml
type: custom:babybuddy-overview-card
entity: sensor.babybuddy_api_changes
mode: diaper
```

**Configuration options:**

```yaml
type: custom:babybuddy-overview-card
entity: sensor.babybuddy_api_changes  # or sensor.babybuddy_api_feedings
mode: diaper  # 'diaper' or 'feeding'
title: 'Recent Changes'  # Optional custom title
limit: 10  # Maximum number of events to display
show_tags: true  # Show tags for each event
show_times: true  # Show timestamps
relative_times: true  # Show relative times (e.g., "2h ago") instead of absolute
```

**Features:**
- Display recent events with relative timestamps ("Just now", "2h ago", "3 days ago")
- Show event tags as styled badges
- Support for both diaper changes and feedings
- Separate color coding for diaper types (wet, solid, dry) and feeding types
- Display tags and notes
- Fully translatable across 6 languages

**Example for Diaper Changes:**

```yaml
type: custom:babybuddy-overview-card
entity: sensor.babybuddy_api_changes
mode: diaper
title: Recent Diaper Changes
limit: 15
show_tags: true
show_times: true
relative_times: true
```

**Example for Feedings:**

```yaml
type: custom:babybuddy-overview-card
entity: sensor.babybuddy_api_feedings
mode: feeding
title: Recent Feedings
limit: 10
show_tags: true
```
 
### 🍼 Week Feedings card
The Week Feedings card shows a split bar per day for the last N days (default 7), with left vs right counts and a subtitle showing total feedings and optional total minutes. All text is configurable/translateable, with singular/plural forms. Icon is configurable and defaults to mdi:baby-bottle.

Example:
```yaml
type: 'custom:babybuddy-feedings-card'
entity: sensor.babybuddy_api_feedings
days: 7
title: Breastfeeding
subtitle: Last week
label_left: left
label_right: right

# Pluralization
label_feedings_singular: feeding
label_feedings_plural: feedings
label_minutes_singular: minute
label_minutes_plural: minutes

# Relative day strings
label_today: today
label_yesterday: yesterday
label_days_ago_fmt: '{n} days ago'

# Appearance
show_minutes: true
icon: mdi:baby-bottle
color_left: '#1f77b4'
color_right: '#ff7f0e'
bar_height: 28
```

Localization example (Swedish):
```yaml
title: Amning
subtitle: Senaste veckan
label_left: vänster
label_right: höger
label_feedings_singular: matning
label_feedings_plural: matningar
label_minutes_singular: minut
label_minutes_plural: minuter
label_today: idag
label_yesterday: igår
label_days_ago_fmt: '{n} dagar sedan'
icon: mdi:baby-bottle
```

### Notes
- The cards automatically load ApexCharts from CDN; if your environment blocks CDNs, self-host the library and add it as a resource before the cards.

### Direct REST sensor support

- These cards don't work with the babybuddy integration since that don't include everything we need to know so you need to create the following rest sensors.

```yaml
rest:
- resource: https://baby.example.com/api/feedings/?limit=500
  method: GET
  headers:
    Authorization: "Token 123456789"
    Accept: "application/json"
  scan_interval: 60
  sensor:
  - name: "BabyBuddy API Feedings"
    unique_id: babybuddy_api_feedings
    value_template: "{{ value_json.count }}"
    json_attributes:
    - results

- resource: https://baby.example.com/api/weight/
  method: GET
  headers:
    Authorization: "Token 123456789"
    Accept: "application/json"
  scan_interval: 60
  sensor:
  - name: "BabyBuddy API Weight"
    unique_id: babybuddy_api_weight
    value_template: "{{ value_json.count }}"
    json_attributes:
    - results

- resource: https://baby.example.com/api/height/
  method: GET
  headers:
    Authorization: "Token 123456789"
    Accept: "application/json"
  scan_interval: 60
  sensor:
  - name: "BabyBuddy API Height"
    unique_id: babybuddy_api_height
    value_template: "{{ value_json.count }}"
    json_attributes:
    - results

- resource: https://baby.example.com/api/head-circumference/
  method: GET
  headers:
    Authorization: "Token 123456789"
    Accept: "application/json"
  scan_interval: 60
  sensor:
  - name: "BabyBuddy API Head circumference"
    unique_id: babybuddy_api_head-circumference
    value_template: "{{ value_json.count }}"
    json_attributes:
    - results

- resource: https://baby.example.com/api/changes/
  method: GET
  headers:
    Authorization: "Token 123456789"
    Accept: "application/json"
  scan_interval: 60
  sensor:
  - name: "BabyBuddy API Diaper changes"
    unique_id: babybuddy_api_changes
    value_template: "{{ value_json.count }}"
    json_attributes:
    - results
```

### Troubleshooting: empty graphs

- If the graphs are empty and the browser console shows messages about blocked access to `https://cdn.jsdelivr.net/npm/apexcharts` or similar, your browser's tracking prevention or content blocking is preventing the ApexCharts library from loading from the CDN. The cards will attempt to fall back to a local copy at `/local/custom_cards/libs/apexcharts.min.js`.
- To self-host ApexCharts:
  1. Download a copy of ApexCharts (minified) from the official distribution (e.g. `https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.min.js`).
  2. Save it to `www/custom_cards/libs/apexcharts.min.js` in this repository so it will be available as `/local/custom_cards/libs/apexcharts.min.js` inside Home Assistant.
  3. Hard-refresh the Lovelace page (Cmd+Shift+R on macOS) to ensure the new file is loaded.
