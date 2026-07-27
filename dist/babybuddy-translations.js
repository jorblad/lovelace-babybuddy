// BabyBuddy Card Translations
const BabyBuddyTranslations = {
  en: {
    diaper: {
      card: {
        title: 'Add Diaper Change',
        button_text: 'Log Diaper'
      },
      form: {
        time: 'Time',
        type: 'Type',
        color: 'Color',
        amount: 'Amount',
        notes: 'Notes',
        tags: 'Tags',
        submit: 'Add Change',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      types: {
        wet: 'Wet',
        solid: 'Solid',
        wet_and_solid: 'Wet and Solid',
        dry: 'Dry'
      },
      colors: {
        black: 'Black',
        brown: 'Brown',
        green: 'Green',
        yellow: 'Yellow'
      },
      notifications: {
        success: 'Diaper change logged successfully!',
        error: 'Error: {error}'
      },
      config: {
        title: 'Card Title',
        button_text: 'Button Text',
        device_id: 'Baby Device',
        default_type: 'Default Type',
        default_color: 'Default Color',
        show_amount: 'Show Amount Field',
        default_amount: 'Default Amount',
        show_notes: 'Show Notes Field',
        tags: 'Available Tags',
        tags_helper: 'Enter tag names (one per line) that will appear as toggles in the popup'
      },
      sections: {
        defaults: 'Defaults',
        optional_fields: 'Optional Fields',
        tags: 'Tags'
      }
    },
    feeding: {
      card: {
        title: 'Add Feeding',
        button_text: 'Log Feeding'
      },
      form: {
        start_time: 'Start and End Time',
        time_help: 'Start time and end time (left to right)',
        type: 'Type',
        method: 'Method',
        amount: 'Amount',
        notes: 'Notes',
        tags: 'Tags',
        submit: 'Add Feeding',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      types: {
        breast_milk: 'Breast milk',
        formula: 'Formula',
        fortified_breast_milk: 'Fortified breast milk',
        solid_food: 'Solid food'
      },
      methods: {
        bottle: 'Bottle',
        left_breast: 'Left breast',
        right_breast: 'Right breast',
        both_breasts: 'Both breasts',
        parent_fed: 'Parent fed',
        self_fed: 'Self fed'
      },
      notifications: {
        success: 'Feeding logged successfully!',
        error: 'Error: {error}'
      },
      config: {
        title: 'Card Title',
        button_text: 'Button Text',
        device_id: 'Baby Device',
        default_type: 'Default Type',
        default_method: 'Default Method',
        default_duration: 'Default Duration (minutes)',
        show_amount: 'Show Amount Field',
        default_amount: 'Default Amount',
        show_notes: 'Show Notes Field',
        tags: 'Available Tags',
        tags_helper: 'Enter tag names (one per line) that will appear as toggles in the popup'
      },
      sections: {
        defaults: 'Defaults',
        optional_fields: 'Optional Fields',
        tags: 'Tags'
      }
    },
    overview: {
      card: {
        title_diaper: 'Recent Diaper Changes',
        title_feeding: 'Recent Feedings'
      },
      just_now: 'Just now',
      ago: 'ago',
      no_data: 'No data available',
      mode_diaper: 'Diaper Changes',
      mode_feeding: 'Feedings',
      config: {
        title: 'Card Title',
        entity: 'Entity',
        mode: 'Mode',
        limit: 'Limit',
        show_tags: 'Show Tags',
        show_times: 'Show Times',
        relative_times: 'Relative Times'
      },
      config_helper: {
        title: 'Custom title for the card',
        entity: 'Sensor entity with results array',
        mode: 'Show diaper changes or feedings',
        limit: 'Maximum number of events to display',
        show_tags: 'Display tags for each event',
        show_times: 'Display timestamps',
        relative_times: 'Show relative times instead of absolute'
      }
    },
    sleep: {
      card: {
        title: 'Add Sleep',
        button_text: 'Log Sleep'
      },
      form: {
        start_time: 'Start and End Time',
        time_help: 'Start time and end time (left to right)',
        nap: 'Nap',
        duration: 'Duration (minutes)',
        notes: 'Notes',
        tags: 'Tags',
        submit: 'Add Sleep',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      notifications: {
        success: 'Sleep logged successfully!',
        error: 'Error: {error}'
      },
      config: {
        title: 'Card Title',
        button_text: 'Button Text',
        device_id: 'Baby Device',
        default_nap: 'Default Nap',
        default_duration: 'Default Duration (minutes)',
        show_notes: 'Show Notes Field',
        tags: 'Available Tags',
        tags_helper: 'Enter tag names (one per line) that will appear as toggles in the popup'
      },
      sections: {
        defaults: 'Defaults',
        notes_tags: 'Notes & Tags'
      }
    },
    growth: {
      card: {
        title: 'Add Measurement',
        button_text: 'Log Measurement'
      },
      form: {
        type: 'Measurement Type',
        date: 'Date',
        value_weight: 'Weight (kg)',
        value_height: 'Height (cm)',
        value_head: 'Head circumference (cm)',
        notes: 'Notes',
        tags: 'Tags',
        submit: 'Add Measurement',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      types: {
        weight: 'Weight',
        height: 'Height',
        head: 'Head circumference'
      },
      notifications: {
        success: 'Measurement logged successfully!',
        error: 'Error: {error}'
      },
      config: {
        title: 'Card Title',
        button_text: 'Button Text',
        device_id: 'Baby Device',
        default_type: 'Default Measurement Type',
        show_notes: 'Show Notes Field',
        tags: 'Available Tags',
        tags_helper: 'Enter tag names (one per line) that will appear as toggles in the popup'
      },
      sections: {
        defaults: 'Defaults',
        notes_tags: 'Notes & Tags'
      }
    },
    note: {
      card: {
        title: 'Add Note',
        button_text: 'Add Note'
      },
      form: {
        time: 'Time',
        note: 'Note',
        note_placeholder: 'Write your note…',
        tags: 'Tags',
        submit: 'Add Note',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      notifications: {
        success: 'Note added successfully!',
        error: 'Error: {error}'
      },
      sections: {
        options: 'Options'
      },
      config: {
        title: 'Card Title',
        button_text: 'Button Text',
        device_id: 'Baby Device',
        show_time: 'Show Time Picker',
        tags: 'Available Tags'
      },
      config_helper: {
        tags: 'These tags will be selectable when adding a note'
      }
    },
    timeline: {
      labels: {
        left: 'Left breast',
        right: 'Right breast',
        both: 'Both breasts',
        bottle: 'Bottle',
        other: 'Other',
        solid_food: 'Solid food',
        wet: 'Wet',
        solid: 'Solid',
        dry: 'Dry'
      },
      config: {
        feedings_entity: 'Feedings Entity',
        diaper_entity: 'Diaper Entity',
        label_left: 'Left Label',
        label_right: 'Right Label',
        label_both: 'Both Breasts Label',
        label_bottle: 'Bottle Label',
        label_other: 'Other Label',
        label_feed_solid: 'Solid Food Label',
        color_left: 'Left Color',
        color_right: 'Right Color',
        color_both: 'Both Breasts Color',
        color_bottle: 'Bottle Color',
        color_other: 'Other Color',
        color_feed_solid: 'Solid Food Color',
        label_wet: 'Wet Label',
        label_solid: 'Solid Label',
        label_dry: 'Dry Label',
        color_wet: 'Wet Color',
        color_solid: 'Solid Color',
        color_dry: 'Dry Color',
        offsets: 'Offsets',
        offset_labels: 'Offset Labels',
        compare_as_rows: 'Compare as Rows',
        force_midnight: 'Force Midnight X-Axis',
        height: 'Chart height',
        disable_scroll_zoom: 'Disable scroll-to-zoom',
        tooltip_update_debounce_ms: 'Debounce updates while tooltip visible (ms)',
        debug: 'Show Debug Info',
        debug: 'Show Debug Info',
        feed_labels_section: 'Feed Labels',
        feed_colors_section: 'Feed Colors',
        diaper_labels_section: 'Diaper Labels',
        diaper_colors_section: 'Diaper Colors',
        offsets_section: 'Offsets',
        options_section: 'Options'
      },
      config_helper: {
        offsets: 'Example: [0,1,2] or "0,1,2" or "24h,48h". Units: d or h.',
        offset_labels: 'Comma-separated or JSON array. Mapped by index to offsets.',
        disable_scroll_zoom: 'Prevents mouse wheel zoom in the card.',
        tooltip_update_debounce_ms: 'Delay re-render while tooltip is open to avoid flicker.',
        color_left: 'Enter a hex color code (e.g., #ff0000)',
        color_right: 'Enter a hex color code (e.g., #ff0000)',
        color_both: 'Enter a hex color code (e.g., #ff0000)',
        color_bottle: 'Enter a hex color code (e.g., #ff0000)',
        color_other: 'Enter a hex color code (e.g., #ff0000)',
        color_feed_solid: 'Enter a hex color code (e.g., #ff0000)',
        color_wet: 'Enter a hex color code (e.g., #ff0000)',
        color_solid: 'Enter a hex color code (e.g., #ff0000)',
        color_dry: 'Enter a hex color code (e.g., #ff0000)'
      }
    },
    feedings: {
      title: 'Breastfeeding',
      subtitle: 'Last week',
      labels: {
        left: 'left',
        right: 'right',
        both: 'both'
      },
      today: 'today',
      yesterday: 'yesterday',
      days_ago_fmt: '{n} days ago',
      feedings_singular: 'feeding',
      feedings_plural: 'feedings',
      minutes_singular: 'minute',
      minutes_plural: 'minutes',
      config: {
        entity: 'Feedings sensor',
        title: 'Title',
        subtitle: 'Subtitle',
        days: 'Number of days',
        label_left: 'Left label',
        label_right: 'Right label',
        label_both: 'Both label',
        label_feedings_singular: 'Feedings (singular)',
        label_feedings_plural: 'Feedings (plural)',
        label_minutes_singular: 'Minutes (singular)',
        label_minutes_plural: 'Minutes (plural)',
        label_today: '"Today" label',
        label_yesterday: '"Yesterday" label',
        label_days_ago_fmt: '"Days ago" format ({n} = number)',
        show_minutes: 'Show total minutes',
        icon: 'Icon (mdi:...)',
        color_left: 'Left color',
        color_right: 'Right color',
        color_both: 'Both color',
        bar_height: 'Bar height',
        debug: 'Show debug'
      }
    }
  },
  nl: {
    diaper: {
      card: {
        title: 'Luierwissel toevoegen',
        button_text: 'Luier registreren'
      },
      form: {
        time: 'Tijd',
        type: 'Type',
        color: 'Kleur',
        amount: 'Hoeveelheid',
        notes: 'Notities',
        tags: 'Tags',
        submit: 'Toevoegen',
        cancel: 'Annuleren'
      },
      types: {
        wet: 'Nat',
        solid: 'Ontlasting',
        wet_and_solid: 'Nat en Ontlasting',
        dry: 'Droog'
      },
      colors: {
        black: 'Zwart',
        brown: 'Bruin',
        green: 'Groen',
        yellow: 'Geel'
      },
      notifications: {
        success: 'Luierwissel succesvol geregistreerd!',
        error: 'Fout: {error}'
      },
      config: {
        title: 'Kaart titel',
        button_text: 'Knoptekst',
        device_id: 'Baby-apparaat',
        default_type: 'Standaard type',
        default_color: 'Standaard kleur',
        show_amount: 'Hoeveelheidsveld weergeven',
        default_amount: 'Standaard hoeveelheid',
        show_notes: 'Notitieveld weergeven',
        tags: 'Beschikbare tags',
        tags_helper: 'Voer tagnamen in (één per regel) die als schakelaars in het formulier verschijnen'
      },
      sections: {
        defaults: 'Standaarden',
        optional_fields: 'Optionele velden',
        tags: 'Tags'
      }
    },
    feeding: {
      card: {
        title: 'Voeding toevoegen',
        button_text: 'Voeding registreren'
      },
      form: {
        start_time: 'Start- en eindtijd',
        time_help: 'Starttijd en eindtijd (van links naar rechts)',
        type: 'Type',
        method: 'Methode',
        amount: 'Hoeveelheid',
        notes: 'Notities',
        tags: 'Tags',
          submit: 'Voeding toevoegen',
          submitting: 'Verzenden...',
        cancel: 'Annuleren'
      },
      types: {
        breast_milk: 'Moedermelk',
        formula: 'Flesvoeding',
        fortified_breast_milk: 'Verrijkte moedermelk',
        solid_food: 'Vast voedsel'
      },
      methods: {
        bottle: 'Fles',
        left_breast: 'Linkerborst',
        right_breast: 'Rechterborst',
        both_breasts: 'Beide borsten',
        parent_fed: 'Gevoerd door ouder',
        self_fed: 'Zelf gevoed'
      },
      notifications: {
        success: 'Voeding succesvol geregistreerd!',
        error: 'Fout: {error}'
      },
      config: {
        title: 'Kaart titel',
        button_text: 'Knoptekst',
        device_id: 'Baby-apparaat',
        default_type: 'Standaard type',
        default_method: 'Standaard methode',
        default_duration: 'Standaard duur (minuten)',
        show_amount: 'Hoeveelheidsveld weergeven',
        default_amount: 'Standaard hoeveelheid',
        show_notes: 'Notitieveld weergeven',
        tags: 'Beschikbare tags',
        tags_helper: 'Voer tagnamen in (één per regel) die als schakelaars in het formulier verschijnen'
      },
      sections: {
        defaults: 'Standaarden',
        optional_fields: 'Optionele velden',
        tags: 'Tags'
      }
    },
    overview: {
      card: {
        title_diaper: 'Recente Luierwissels',
        title_feeding: 'Recente Voedingen'
      },
      just_now: 'Zojuist',
      ago: 'geleden',
      no_data: 'Geen gegevens beschikbaar',
      mode_diaper: 'Luierwissels',
      mode_feeding: 'Voedingen',
      config: {
        title: 'Kaart titel',
        entity: 'Entiteit',
        mode: 'Modus',
        limit: 'Limiet',
        show_tags: 'Tags weergeven',
        show_times: 'Tijden weergeven',
        relative_times: 'Relatieve tijden'
      },
      config_helper: {
        title: 'Aangepaste titel voor de kaart',
        entity: 'Sensor-entiteit met results-array',
        mode: 'Luierwissels of voedingen weergeven',
        limit: 'Maximaal aantal weer te geven gebeurtenissen',
        show_tags: 'Tags voor elke gebeurtenis weergeven',
        show_times: 'Tijdstempels weergeven',
        relative_times: 'Relatieve tijden in plaats van absolute'
      }
    },
    sleep: {
      card: {
        title: 'Slaap toevoegen',
        button_text: 'Slaap registreren'
      },
      form: {
        start_time: 'Start- en eindtijd',
        time_help: 'Starttijd en eindtijd (van links naar rechts)',
        nap: 'Slaapje',
        duration: 'Duur (minuten)',
        notes: 'Notities',
        tags: 'Tags',
          submit: 'Slaap toevoegen',
          submitting: 'Verzenden...',
        cancel: 'Annuleren'
      },
      notifications: {
        success: 'Slaap succesvol geregistreerd!',
        error: 'Fout: {error}'
      },
      config: {
        title: 'Kaart titel',
        button_text: 'Knoptekst',
        device_id: 'Baby-apparaat',
        default_nap: 'Standaard slaapje',
        default_duration: 'Standaard duur (minuten)',
        show_notes: 'Notitieveld weergeven',
        tags: 'Beschikbare tags',
        tags_helper: 'Voer tagnamen in (één per regel) die als schakelaars in het popup-formulier verschijnen'
      },
      sections: {
        defaults: 'Standaarden',
        notes_tags: 'Notities & Tags'
      }
    },
    growth: {
      card: {
        title: 'Meting toevoegen',
        button_text: 'Meting registreren'
      },
      form: {
        type: 'Type meting',
        date: 'Datum',
        value_weight: 'Gewicht (kg)',
        value_height: 'Lengte (cm)',
        value_head: 'Hoofdomtrek (cm)',
        notes: 'Notities',
        tags: 'Tags',
          submit: 'Meting toevoegen',
          submitting: 'Verzenden...',
        cancel: 'Annuleren'
      },
      types: {
        weight: 'Gewicht',
        height: 'Lengte',
        head: 'Hoofdomtrek'
      },
      notifications: {
        success: 'Meting succesvol geregistreerd!',
        error: 'Fout: {error}'
      },
      config: {
        title: 'Kaarttitel',
        button_text: 'Knoptekst',
        device_id: 'Baby-apparaat',
        default_type: 'Standaard meettype',
        show_notes: 'Notitieveld weergeven',
        tags: 'Beschikbare tags',
        tags_helper: 'Voer tagnamen in (één per regel) die als schakelaars verschijnen'
      },
      sections: {
        defaults: 'Standaarden',
        notes_tags: 'Notities & Tags'
      }
    },
    note: {
      card: {
        title: 'Add Note',
        button_text: 'Add Note'
      },
      form: {
        time: 'Time',
        note: 'Note',
        note_placeholder: 'Write your note…',
        tags: 'Tags',
        submit: 'Add Note',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      notifications: {
        success: 'Note added successfully!',
        error: 'Error: {error}'
      },
      sections: {
        options: 'Options'
      },
      config: {
        title: 'Card Title',
        button_text: 'Button Text',
        device_id: 'Baby Device',
        show_time: 'Show Time Picker',
        tags: 'Available Tags'
      },
      config_helper: {
        tags: 'These tags will be selectable when adding a note'
      }
    },
    timeline: {
      labels: {
        left: 'Linkerborst',
        right: 'Rechterborst',
        both: 'Beide borsten',
        bottle: 'Fles',
        other: 'Overig',
        solid_food: 'Vast voedsel',
        wet: 'Nat',
        solid: 'Ontlasting',
        dry: 'Droog'
      },
      config: {
        feedings_entity: 'Voedingen entiteit',
        diaper_entity: 'Luier entiteit',
        label_left: 'Label links',
        label_right: 'Label rechts',
        label_both: 'Label beide borsten',
        label_bottle: 'Label fles',
        label_other: 'Label overig',
        label_feed_solid: 'Label vast voedsel',
        color_left: 'Kleur links',
        color_right: 'Kleur rechts',
        color_both: 'Kleur beide borsten',
        color_bottle: 'Kleur fles',
        color_other: 'Kleur overig',
        color_feed_solid: 'Kleur vast voedsel',
        label_wet: 'Label nat',
        label_solid: 'Label ontlasting',
        label_dry: 'Label droog',
        color_wet: 'Kleur nat',
        color_solid: 'Kleur ontlasting',
        color_dry: 'Kleur droog',
        offsets: 'Offsets',
        offset_labels: 'Offset labels',
        compare_as_rows: 'Vergelijk als rijen',
        force_midnight: 'Forceer middernacht X-as',
        height: 'Grafiekhoogte',
        disable_scroll_zoom: 'Scroll-to-zoom uitschakelen',
        tooltip_update_debounce_ms: 'Updates debounce terwijl tooltip zichtbaar is (ms)',
        debug: 'Debuginfo tonen',
        debug: 'Debuginfo tonen',
        feed_labels_section: 'Voeding labels',
        feed_colors_section: 'Voeding kleuren',
        diaper_labels_section: 'Luier labels',
        diaper_colors_section: 'Luier kleuren',
        offsets_section: 'Offsets',
        options_section: 'Opties'
      },
      config_helper: {
        offsets: 'Voorbeeld: [0,1,2] of "0,1,2" of "24h,48h". Eenheden: d of h.',
        offset_labels: 'Komma-gescheiden of JSON-array. Op index gekoppeld aan offsets.',
        disable_scroll_zoom: 'Voorkomt muiswiel-zoom in de kaart.',
        tooltip_update_debounce_ms: 'Vertraag herrendering terwijl tooltip open is om flikkeren te voorkomen.',
        color_left: 'Voer een hex-kleurcode in (bijv. #ff0000)',
        color_right: 'Voer een hex-kleurcode in (bijv. #ff0000)',
        color_both: 'Voer een hex-kleurcode in (bijv. #ff0000)',
        color_bottle: 'Voer een hex-kleurcode in (bijv. #ff0000)',
        color_other: 'Voer een hex-kleurcode in (bijv. #ff0000)',
        color_feed_solid: 'Voer een hex-kleurcode in (bijv. #ff0000)',
        color_wet: 'Voer een hex-kleurcode in (bijv. #ff0000)',
        color_solid: 'Voer een hex-kleurcode in (bijv. #ff0000)',
        color_dry: 'Voer een hex-kleurcode in (bijv. #ff0000)'
      }
    },
    feedings: {
      title: 'Voeding',
      subtitle: 'Afgelopen week',
      labels: {
        left: 'links',
        right: 'rechts',
        both: 'beide'
      },
      today: 'vandaag',
      yesterday: 'gisteren',
      days_ago_fmt: '{n} dagen geleden',
      feedings_singular: 'voeding',
      feedings_plural: 'voedingen',
      minutes_singular: 'minuut',
      minutes_plural: 'minuten',
      config: {
        entity: 'Voedingen sensor',
        title: 'Titel',
        subtitle: 'Ondertitel',
        days: 'Aantal dagen',
        label_left: 'Label links',
        label_right: 'Label rechts',
        label_both: 'Label beide',
        label_feedings_singular: 'Voeding (enkelvoud)',
        label_feedings_plural: 'Voeding (meervoud)',
        label_minutes_singular: 'Minuten (enkelvoud)',
        label_minutes_plural: 'Minuten (meervoud)',
        label_today: '"Vandaag" label',
        label_yesterday: '"Gisteren" label',
        label_days_ago_fmt: '"Dagen geleden" formaat ({n} = aantal)',
        show_minutes: 'Toon totale minuten',
        icon: 'Icoon (mdi:...)',
        color_left: 'Kleur links',
        color_right: 'Kleur rechts',
        color_both: 'Kleur beide',
        bar_height: 'Balkhoogte',
        debug: 'Debug tonen'
      }
    }

  },
  de: {
    diaper: {
      card: {
        title: 'Windelwechsel hinzufügen',
        button_text: 'Windel protokollieren'
      },
      form: {
        time: 'Zeit',
        type: 'Typ',
        color: 'Farbe',
        amount: 'Menge',
        notes: 'Notizen',
        tags: 'Tags',
        submit: 'Hinzufügen',
        submitting: 'Senden...',
        cancel: 'Abbrechen'
      },
      types: {
        wet: 'Nass',
        solid: 'Fest',
        wet_and_solid: 'Nass und Fest',
        dry: 'Trocken'
      },
      colors: {
        black: 'Schwarz',
        brown: 'Braun',
        green: 'Grün',
        yellow: 'Gelb'
      },
      notifications: {
        success: 'Windelwechsel erfolgreich protokolliert!',
        error: 'Fehler: {error}'
      },
      config: {
        title: 'Kartentitel',
        button_text: 'Schaltflächentext',
        device_id: 'Baby-Gerät',
        default_type: 'Standardtyp',
        default_color: 'Standardfarbe',
        show_amount: 'Mengenfeld anzeigen',
        default_amount: 'Standardmenge',
        show_notes: 'Notizfeld anzeigen',
        tags: 'Verfügbare Tags',
        tags_helper: 'Geben Sie Tagnamen ein (einer pro Zeile), die als Umschalter im Formular angezeigt werden'
      },
      sections: {
        defaults: 'Standard',
        optional_fields: 'Optionale Felder',
        tags: 'Tags'
      }
    },
    feeding: {
      card: {
        title: 'Fütterung hinzufügen',
        button_text: 'Fütterung protokollieren'
      },
      form: {
        start_time: 'Start- und Endzeit',
        time_help: 'Startzeit und Endzeit (von links nach rechts)',
        type: 'Typ',
        method: 'Methode',
        amount: 'Menge',
        notes: 'Notizen',
        tags: 'Tags',
        submit: 'Fütterung hinzufügen',
        submitting: 'Senden...',
        cancel: 'Abbrechen'
      },
      types: {
        breast_milk: 'Muttermilch',
        formula: 'Säuglingsnahrung',
        fortified_breast_milk: 'Angereicherte Muttermilch',
        solid_food: 'Festnahrung'
      },
      methods: {
        bottle: 'Flasche',
        left_breast: 'Linke Brust',
        right_breast: 'Rechte Brust',
        both_breasts: 'Beide Brüste',
        parent_fed: 'Vom Elternteil gefüttert',
        self_fed: 'Selbst gefüttert'
      },
      notifications: {
        success: 'Fütterung erfolgreich protokolliert!',
        error: 'Fehler: {error}'
      },
      config: {
        title: 'Kartentitel',
        button_text: 'Schaltflächentext',
        device_id: 'Baby-Gerät',
        default_type: 'Standardtyp',
        default_method: 'Standardmethode',
        default_duration: 'Standarddauer (Minuten)',
        show_amount: 'Mengenfeld anzeigen',
        default_amount: 'Standardmenge',
        show_notes: 'Notizfeld anzeigen',
        tags: 'Verfügbare Tags',
        tags_helper: 'Geben Sie Tagnamen ein (einer pro Zeile), die als Umschalter im Formular angezeigt werden'
      },
      sections: {
        defaults: 'Standard',
        optional_fields: 'Optionale Felder',
        tags: 'Tags'
      }
    },
    overview: {
      card: {
        title_diaper: 'Kürzliche Windelwechsel',
        title_feeding: 'Kürzliche Fütterungen'
      },
      just_now: 'Gerade eben',
      ago: 'vor',
      no_data: 'Keine Daten verfügbar',
      mode_diaper: 'Windelwechsel',
      mode_feeding: 'Fütterungen',
      config: {
        title: 'Kartentitel',
        entity: 'Entität',
        mode: 'Modus',
        limit: 'Limit',
        show_tags: 'Tags anzeigen',
        show_times: 'Zeiten anzeigen',
        relative_times: 'Relative Zeiten'
      },
      config_helper: {
        title: 'Benutzerdefinierter Titel für die Karte',
        entity: 'Sensor-Entität mit Results-Array',
        mode: 'Windelwechsel oder Fütterungen anzeigen',
        limit: 'Maximale Anzahl anzuzeigender Ereignisse',
        show_tags: 'Tags für jedes Ereignis anzeigen',
        show_times: 'Zeitstempel anzeigen',
        relative_times: 'Relative Zeiten statt absoluter'
      }
    },
    sleep: {
      card: {
        title: 'Schlaf hinzufügen',
        button_text: 'Schlaf protokollieren'
      },
      form: {
        start_time: 'Start- und Endzeit',
        time_help: 'Startzeit und Endzeit (von links nach rechts)',
        nap: 'Schläfchen',
        duration: 'Dauer (Minuten)',
        notes: 'Notizen',
        tags: 'Tags',
        submit: 'Schlaf hinzufügen',
        submitting: 'Senden...',
        cancel: 'Abbrechen'
      },
      notifications: {
        success: 'Schlaf erfolgreich protokolliert!',
        error: 'Fehler: {error}'
      },
      config: {
        title: 'Kartentitel',
        button_text: 'Schaltflächentext',
        device_id: 'Baby-Gerät',
        default_nap: 'Standard-Schläfchen',
        default_duration: 'Standarddauer (Minuten)',
        show_notes: 'Notizfeld anzeigen',
        tags: 'Verfügbare Tags',
        tags_helper: 'Geben Sie Tagnamen ein (einer pro Zeile), die als Umschalter im Popup-Formular erscheinen'
      },
      sections: {
        defaults: 'Standard',
        notes_tags: 'Notizen & Tags'
      }
    },
    growth: {
      card: {
        title: 'Messung hinzufügen',
        button_text: 'Messung protokollieren'
      },
      form: {
        type: 'Messtyp',
        date: 'Datum',
        value_weight: 'Gewicht (kg)',
        value_height: 'Größe (cm)',
        value_head: 'Kopfumfang (cm)',
        notes: 'Notizen',
        tags: 'Tags',
        submit: 'Messung hinzufügen',
        submitting: 'Senden...',
        cancel: 'Abbrechen'
      },
      types: {
        weight: 'Gewicht',
        height: 'Größe',
        head: 'Kopfumfang'
      },
      notifications: {
        success: 'Messung erfolgreich gespeichert!',
        error: 'Fehler: {error}'
      },
      config: {
        title: 'Kartentitel',
        button_text: 'Schaltflächentext',
        device_id: 'Baby-Gerät',
        default_type: 'Standard-Messtyp',
        show_notes: 'Notizfeld anzeigen',
        tags: 'Verfügbare Tags',
        tags_helper: 'Geben Sie Tagnamen ein (einer pro Zeile), die als Umschalter im Popup angezeigt werden'
      },
      sections: {
        defaults: 'Standard',
        notes_tags: 'Notizen & Tags'
      }
    },
    note: {
      card: {
        title: 'Add Note',
        button_text: 'Add Note'
      },
      form: {
        time: 'Time',
        note: 'Note',
        note_placeholder: 'Write your note…',
        tags: 'Tags',
        submit: 'Add Note',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      notifications: {
        success: 'Note added successfully!',
        error: 'Error: {error}'
      },
      sections: {
        options: 'Options'
      },
      config: {
        title: 'Card Title',
        button_text: 'Button Text',
        device_id: 'Baby Device',
        show_time: 'Show Time Picker',
        tags: 'Available Tags'
      },
      config_helper: {
        tags: 'These tags will be selectable when adding a note'
      }
    },
    timeline: {
      labels: {
        left: 'Linke Brust',
        right: 'Rechte Brust',
        both: 'Beide Brüste',
        bottle: 'Flasche',
        other: 'Sonstiges',
        solid_food: 'Festnahrung',
        wet: 'Nass',
        solid: 'Fest',
        dry: 'Trocken'
      },
      config: {
        feedings_entity: 'Fütterungen-Entität',
        diaper_entity: 'Windel-Entität',
        label_left: 'Label links',
        label_right: 'Label rechts',
        label_both: 'Label beide Brüste',
        label_bottle: 'Label Flasche',
        label_other: 'Label sonstiges',
        label_feed_solid: 'Label Festnahrung',
        color_left: 'Farbe links',
        color_right: 'Farbe rechts',
        color_both: 'Farbe beide Brüste',
        color_bottle: 'Farbe Flasche',
        color_other: 'Farbe sonstiges',
        color_feed_solid: 'Farbe Festnahrung',
        label_wet: 'Label nass',
        label_solid: 'Label fest',
        label_dry: 'Label trocken',
        color_wet: 'Farbe nass',
        color_solid: 'Farbe fest',
        color_dry: 'Farbe trocken',
        offsets: 'Offsets',
        offset_labels: 'Offset-Labels',
        compare_as_rows: 'Als Zeilen vergleichen',
        force_midnight: 'Mitternacht X-Achse erzwingen',
        height: 'Diagrammhöhe',
        disable_scroll_zoom: 'Scroll-Zoom deaktivieren',
        tooltip_update_debounce_ms: 'Updates verzögern während Tooltip sichtbar (ms)',
        debug: 'Debug-Info anzeigen',
        debug: 'Debug-Info anzeigen',
        feed_labels_section: 'Fütterung Labels',
        feed_colors_section: 'Fütterung Farben',
        diaper_labels_section: 'Windel Labels',
        diaper_colors_section: 'Windel Farben',
        offsets_section: 'Offsets',
        options_section: 'Optionen'
      },
      config_helper: {
        offsets: 'Beispiel: [0,1,2] oder "0,1,2" oder "24h,48h". Einheiten: d oder h.',
        offset_labels: 'Komma-getrennt oder JSON-Array. Nach Index den Offsets zugeordnet.',
        disable_scroll_zoom: 'Verhindert Mausrad-Zoom in der Karte.',
        tooltip_update_debounce_ms: 'Verzögert das Neu-rendern während der Tooltip geöffnet ist, um Flackern zu vermeiden.',
        color_left: 'Hex-Farbcode eingeben (z.B. #ff0000)',
        color_right: 'Hex-Farbcode eingeben (z.B. #ff0000)',
        color_both: 'Hex-Farbcode eingeben (z.B. #ff0000)',
        color_bottle: 'Hex-Farbcode eingeben (z.B. #ff0000)',
        color_other: 'Hex-Farbcode eingeben (z.B. #ff0000)',
        color_feed_solid: 'Hex-Farbcode eingeben (z.B. #ff0000)',
        color_wet: 'Hex-Farbcode eingeben (z.B. #ff0000)',
        color_solid: 'Hex-Farbcode eingeben (z.B. #ff0000)',
        color_dry: 'Hex-Farbcode eingeben (z.B. #ff0000)'
      }
    },
    feedings: {
      title: 'Stillen',
      subtitle: 'Letzte Woche',
      labels: {
        left: 'links',
        right: 'rechts',
        both: 'beide'
      },
      today: 'heute',
      yesterday: 'gestern',
      days_ago_fmt: 'vor {n} Tagen',
      feedings_singular: 'Fütterung',
      feedings_plural: 'Fütterungen',
      minutes_singular: 'Minute',
      minutes_plural: 'Minuten',
      config: {
        entity: 'Fütterungen-Sensor',
        title: 'Titel',
        subtitle: 'Untertitel',
        days: 'Anzahl Tage',
        label_left: 'Label links',
        label_right: 'Label rechts',
        label_both: 'Label beide',
        label_feedings_singular: 'Fütterung (Singular)',
        label_feedings_plural: 'Fütterung (Plural)',
        label_minutes_singular: 'Minuten (Singular)',
        label_minutes_plural: 'Minuten (Plural)',
        label_today: '"Heute" Label',
        label_yesterday: '"Gestern" Label',
        label_days_ago_fmt: '"Tage her" Format ({n} = Anzahl)',
        show_minutes: 'Gesamtminuten anzeigen',
        icon: 'Symbol (mdi:...)',
        color_left: 'Farbe links',
        color_right: 'Farbe rechts',
        color_both: 'Farbe beide',
        bar_height: 'Balkenhöhe',
        debug: 'Debug anzeigen'
      }
    }
  },
  fr: {
    diaper: {
      card: {
        title: 'Ajouter un changement de couche',
        button_text: 'Enregistrer la couche',
        submit: 'Add Note',
        submitting: 'Verzenden...',
      },
      form: {
        time: 'Heure',
        type: 'Type',
        color: 'Couleur',
        amount: 'Montant',
        notes: 'Notes',
        tags: 'Tags',
        submit: 'Ajouter',
        submitting: 'Envoi...',
        cancel: 'Annuler'
      },
      types: {
        wet: 'Mouillé',
        solid: 'Solide',
        wet_and_solid: 'Mouillé et Solide',
        dry: 'Sec'
      },
      colors: {
        black: 'Noir',
        brown: 'Marron',
        green: 'Vert',
        yellow: 'Jaune'
      },
      notifications: {
        success: 'Changement de couche enregistré avec succès!',
        error: 'Erreur: {error}'
      },
      config: {
        title: 'Titre de la carte',
        button_text: 'Texte du bouton',
        device_id: 'Appareil bébé',
        default_type: 'Type par défaut',
        default_color: 'Couleur par défaut',
        show_amount: 'Afficher le champ de montant',
        default_amount: 'Montant par défaut',
        show_notes: 'Afficher le champ des notes',
        tags: 'Tags disponibles',
        tags_helper: 'Entrez les noms des tags (un par ligne) qui apparaîtront comme des boutons bascule dans le formulaire'
      },
      sections: {
        defaults: 'Valeurs par défaut',
        optional_fields: 'Champs optionnels',
        tags: 'Tags'
      }
    },
    feeding: {
      card: {
        title: 'Ajouter une alimentation',
        button_text: 'Enregistrer l\'alimentation'
      },
      form: {
        start_time: 'Heure de début et de fin',
        time_help: 'Heure de début et heure de fin (de gauche à droite)',
        type: 'Type',
        method: 'Méthode',
        amount: 'Montant',
        notes: 'Notes',
        tags: 'Tags',
        submit: 'Ajouter alimentation',
        submitting: 'Envoi...',
        cancel: 'Annuler'
      },
      types: {
        breast_milk: 'Lait maternel',
        formula: 'Lait maternisé',
        fortified_breast_milk: 'Lait maternel enrichi',
        solid_food: 'Aliments solides'
      },
      methods: {
        bottle: 'Biberon',
        left_breast: 'Sein gauche',
        right_breast: 'Sein droit',
        both_breasts: 'Les deux seins',
        parent_fed: 'Nourri par le parent',
        self_fed: 'Nourri par lui-même'
      },
      notifications: {
        success: 'Alimentation enregistrée avec succès!',
        error: 'Erreur: {error}'
      },
      config: {
        title: 'Titre de la carte',
        button_text: 'Texte du bouton',
        device_id: 'Appareil bébé',
        default_type: 'Type par défaut',
        default_method: 'Méthode par défaut',
        default_duration: 'Durée par défaut (minutes)',
        show_amount: 'Afficher le champ de montant',
        default_amount: 'Montant par défaut',
        show_notes: 'Afficher le champ des notes',
        tags: 'Tags disponibles',
        tags_helper: 'Entrez les noms des tags (un par ligne) qui apparaîtront comme des boutons bascule dans le formulaire'
      },
      sections: {
        defaults: 'Valeurs par défaut',
        optional_fields: 'Champs optionnels',
        tags: 'Tags'
      }
    },
    overview: {
      card: {
        title_diaper: 'Changements de couche récents',
        title_feeding: 'Alimentations récentes'
      },
      just_now: 'À l\'instant',
      ago: 'il y a',
      no_data: 'Aucune donnée disponible',
      mode_diaper: 'Changements de couche',
      mode_feeding: 'Alimentations',
      config: {
        title: 'Titre de la carte',
        entity: 'Entité',
        mode: 'Mode',
        limit: 'Limite',
        show_tags: 'Afficher les tags',
        show_times: 'Afficher les heures',
        relative_times: 'Heures relatives'
      },
      config_helper: {
        title: 'Titre personnalisé pour la carte',
        entity: 'Entité capteur avec tableau de résultats',
        mode: 'Afficher les changements de couche ou les alimentations',
        limit: 'Nombre maximum d\'événements à afficher',
        show_tags: 'Afficher les tags pour chaque événement',
        show_times: 'Afficher les horodatages',
        relative_times: 'Afficher les heures relatives au lieu des heures absolues'
      }
    },
    sleep: {
      card: {
        title: 'Ajouter un sommeil',
        button_text: 'Enregistrer le sommeil'
      },
      form: {
        start_time: 'Heure de début et de fin',
        time_help: 'Heure de début et heure de fin (de gauche à droite)',
        nap: 'Sieste',
        duration: 'Durée (minutes)',
        notes: 'Notes',
        tags: 'Tags',
        submit: 'Ajouter sommeil',
        submitting: 'Envoi...',
        cancel: 'Annuler'
      },
      notifications: {
        success: 'Sommeil enregistré avec succès!',
        error: 'Erreur: {error}'
      },
      config: {
        title: 'Titre de la carte',
        button_text: 'Texte du bouton',
        device_id: 'Appareil bébé',
        default_nap: 'Sieste par défaut',
        default_duration: 'Durée par défaut (minutes)',
        show_notes: 'Afficher le champ des notes',
        tags: 'Tags disponibles',
        tags_helper: 'Entrez les noms des tags (un par ligne) qui apparaîtront comme des boutons bascule dans le formulaire'
      },
      sections: {
        defaults: 'Valeurs par défaut',
        notes_tags: 'Notes & Tags'
      }
    },
    growth: {
      card: {
        title: 'Ajouter une mesure',
        button_text: 'Enregistrer la mesure'
      },
      form: {
        type: 'Type de mesure',
        date: 'Date',
        value_weight: 'Poids (kg)',
        value_height: 'Taille (cm)',
        value_head: 'Périmètre crânien (cm)',
        notes: 'Notes',
        tags: 'Tags',
        submit: 'Ajouter la mesure',
        submitting: 'Envoi...',
        cancel: 'Annuler'
      },
      types: {
        weight: 'Poids',
        height: 'Taille',
        head: 'Périmètre crânien'
      },
      notifications: {
        success: 'Mesure enregistrée avec succès !',
        error: 'Erreur : {error}'
      },
      config: {
        title: 'Titre de la carte',
        button_text: 'Texte du bouton',
        device_id: 'Appareil bébé',
        default_type: 'Type de mesure par défaut',
        show_notes: 'Afficher le champ des notes',
        tags: 'Tags disponibles',
        tags_helper: 'Entrez les noms des tags (un par ligne) affichés comme boutons dans la fenêtre'
      },
      sections: {
        defaults: 'Valeurs par défaut',
        notes_tags: 'Notes & Tags'
      }
    },
    note: {
      card: {
        title: 'Add Note',
        button_text: 'Add Note'
      },
      form: {
        time: 'Time',
        note: 'Note',
        note_placeholder: 'Write your note…',
        tags: 'Tags',
        submit: 'Add Note',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      notifications: {
        success: 'Note added successfully!',
        error: 'Error: {error}'
      },
      sections: {
        options: 'Options'
      },
      config: {
        title: 'Card Title',
        button_text: 'Button Text',
        device_id: 'Baby Device',
        show_time: 'Show Time Picker',
        tags: 'Available Tags'
      },
      config_helper: {
        tags: 'These tags will be selectable when adding a note'
      }
    },
    timeline: {
      labels: {
        left: 'Sein gauche',
        right: 'Sein droit',
        both: 'Les deux seins',
        bottle: 'Biberon',
        other: 'Autre',
        solid_food: 'Aliments solides',
        wet: 'Mouillé',
        solid: 'Solide',
        dry: 'Sec'
      },
      config: {
        feedings_entity: 'Entité alimentations',
        diaper_entity: 'Entité couches',
        label_left: 'Label gauche',
        label_right: 'Label droit',
        label_both: 'Label deux seins',
        label_bottle: 'Label biberon',
        label_other: 'Label autre',
        label_feed_solid: 'Label aliments solides',
        color_left: 'Couleur gauche',
        color_right: 'Couleur droit',
        color_both: 'Couleur deux seins',
        color_bottle: 'Couleur biberon',
        color_other: 'Couleur autre',
        color_feed_solid: 'Couleur aliments solides',
        label_wet: 'Label mouillé',
        label_solid: 'Label solide',
        label_dry: 'Label sec',
        color_wet: 'Couleur mouillé',
        color_solid: 'Couleur solide',
        color_dry: 'Couleur sec',
        offsets: 'Offsets',
        offset_labels: 'Labels offset',
        compare_as_rows: 'Comparer en lignes',
        force_midnight: 'Forcer minuit axe X',
        height: 'Hauteur du graphique',
        disable_scroll_zoom: 'Désactiver le zoom par molette',
        tooltip_update_debounce_ms: 'Debouncer les mises à jour quand l\'infobulle est visible (ms)',
        debug: 'Afficher les infos de debug',
        debug: 'Afficher les infos de debug',
        feed_labels_section: 'Labels alimentation',
        feed_colors_section: 'Couleurs alimentation',
        diaper_labels_section: 'Labels couche',
        diaper_colors_section: 'Couleurs couche',
        offsets_section: 'Offsets',
        options_section: 'Options'
      },
      config_helper: {
        offsets: 'Exemple: [0,1,2] ou "0,1,2" ou "24h,48h". Unités: d ou h.',
        offset_labels: 'Séparés par des virgules ou tableau JSON. Mappés par index aux offsets.',
        disable_scroll_zoom: 'Empêche le zoom à la molette dans la carte.',
        tooltip_update_debounce_ms: 'Délai avant re-rendu quand l\'infobulle est ouverte pour éviter le scintillement.',
        color_left: 'Entrez un code couleur hex (ex: #ff0000)',
        color_right: 'Entrez un code couleur hex (ex: #ff0000)',
        color_both: 'Entrez un code couleur hex (ex: #ff0000)',
        color_bottle: 'Entrez un code couleur hex (ex: #ff0000)',
        color_other: 'Entrez un code couleur hex (ex: #ff0000)',
        color_feed_solid: 'Entrez un code couleur hex (ex: #ff0000)',
        color_wet: 'Entrez un code couleur hex (ex: #ff0000)',
        color_solid: 'Entrez un code couleur hex (ex: #ff0000)',
        color_dry: 'Entrez un code couleur hex (ex: #ff0000)'
      }
    },
    feedings: {
      title: 'Allaitement',
      subtitle: 'Semaine dernière',
      labels: {
        left: 'gauche',
        right: 'droit',
        both: 'deux'
      },
      today: 'aujourd\'hui',
      yesterday: 'hier',
      days_ago_fmt: 'il y a {n} jours',
      feedings_singular: 'alimentation',
      feedings_plural: 'alimentations',
      minutes_singular: 'minute',
      minutes_plural: 'minutes',
      config: {
        entity: 'Capteur alimentations',
        title: 'Titre',
        subtitle: 'Sous-titre',
        days: 'Nombre de jours',
        label_left: 'Label gauche',
        label_right: 'Label droit',
        label_both: 'Label deux',
        label_feedings_singular: 'Alimentation (singulier)',
        label_feedings_plural: 'Alimentation (pluriel)',
        label_minutes_singular: 'Minutes (singulier)',
        label_minutes_plural: 'Minutes (pluriel)',
        label_today: 'Label "Aujourd\'hui"',
        label_yesterday: 'Label "Hier"',
        label_days_ago_fmt: 'Format "jours ago" ({n} = nombre)',
        show_minutes: 'Afficher le total des minutes',
        icon: 'Icône (mdi:...)',
        color_left: 'Couleur gauche',
        color_right: 'Couleur droit',
        color_both: 'Couleur deux',
        bar_height: 'Hauteur de barre',
        debug: 'Afficher debug'
      }
    }

  },
  es: {
    diaper: {
      card: {
        title: 'Agregar cambio de pañal',
        button_text: 'Registrar pañal'
      },
      form: {
        time: 'Hora',
        type: 'Tipo',
        color: 'Color',
        amount: 'Cantidad',
        notes: 'Notas',
        tags: 'Etiquetas',
        submit: 'Agregar',
        submitting: 'Enviando...',
        cancel: 'Cancelar'
      },
      types: {
        wet: 'Mojado',
        solid: 'Sólido',
        wet_and_solid: 'Mojado y Sólido',
        dry: 'Seco'
      },
      colors: {
        black: 'Negro',
        brown: 'Marrón',
        green: 'Verde',
        yellow: 'Amarillo'
      },
      notifications: {
        success: '¡Cambio de pañal registrado exitosamente!',
        error: 'Error: {error}'
      },
      config: {
        title: 'Título de la tarjeta',
        button_text: 'Texto del botón',
        device_id: 'Dispositivo bebé',
        default_type: 'Tipo predeterminado',
        default_color: 'Color predeterminado',
        show_amount: 'Mostrar campo de cantidad',
        default_amount: 'Cantidad predeterminada',
        show_notes: 'Mostrar campo de notas',
        tags: 'Etiquetas disponibles',
        tags_helper: 'Ingrese nombres de etiquetas (uno por línea) que aparecerán como botones de alternancia en el formulario'
      },
      sections: {
        defaults: 'Valores predeterminados',
        optional_fields: 'Campos opcionales',
        tags: 'Etiquetas'
      }
    },
    feeding: {
      card: {
        title: 'Agregar alimentación',
        button_text: 'Registrar alimentación'
      },
      form: {
        start_time: 'Hora de inicio y fin',
        time_help: 'Hora de inicio e hora de finalización (de izquierda a derecha)',
        type: 'Tipo',
        method: 'Método',
        amount: 'Cantidad',
        notes: 'Notas',
        tags: 'Etiquetas',
        submit: 'Agregar alimentación',
        submitting: 'Enviando...',
        cancel: 'Cancelar'
      },
      types: {
        breast_milk: 'Leche materna',
        formula: 'Fórmula infantil',
        fortified_breast_milk: 'Leche materna enriquecida',
        solid_food: 'Alimentos sólidos'
      },
      methods: {
        bottle: 'Biberón',
        left_breast: 'Pecho izquierdo',
        right_breast: 'Pecho derecho',
        both_breasts: 'Ambos pechos',
        parent_fed: 'Alimentado por el padre',
        self_fed: 'Autoalimentado'
      },
      notifications: {
        success: '¡Alimentación registrada exitosamente!',
        error: 'Error: {error}'
      },
      config: {
        title: 'Título de la tarjeta',
        button_text: 'Texto del botón',
        device_id: 'Dispositivo bebé',
        default_type: 'Tipo predeterminado',
        default_method: 'Método predeterminado',
        default_duration: 'Duración predeterminada (minutos)',
        show_amount: 'Mostrar campo de cantidad',
        default_amount: 'Cantidad predeterminada',
        show_notes: 'Mostrar campo de notas',
        tags: 'Etiquetas disponibles',
        tags_helper: 'Ingrese nombres de etiquetas (uno por línea) que aparecerán como botones de alternancia en el formulario'
      },
      sections: {
        defaults: 'Valores predeterminados',
        optional_fields: 'Campos opcionales',
        tags: 'Etiquetas'
      }
    },
    overview: {
      card: {
        title_diaper: 'Cambios de pañal recientes',
        title_feeding: 'Alimentaciones recientes'
      },
      just_now: 'Justo ahora',
      ago: 'hace',
      no_data: 'No hay datos disponibles',
      mode_diaper: 'Cambios de pañal',
      mode_feeding: 'Alimentaciones',
      config: {
        title: 'Título de la tarjeta',
        entity: 'Entidad',
        mode: 'Modo',
        limit: 'Límite',
        show_tags: 'Mostrar etiquetas',
        show_times: 'Mostrar horas',
        relative_times: 'Horas relativas'
      },
      config_helper: {
        title: 'Título personalizado para la tarjeta',
        entity: 'Entidad del sensor con matriz de resultados',
        mode: 'Mostrar cambios de pañal o alimentaciones',
        limit: 'Número máximo de eventos a mostrar',
        show_tags: 'Mostrar etiquetas para cada evento',
        show_times: 'Mostrar marcas de tiempo',
        relative_times: 'Mostrar horas relativas en lugar de absolutas'
      }
    },
    sleep: {
      card: {
        title: 'Agregar sueño',
        button_text: 'Registrar sueño'
      },
      form: {
        start_time: 'Hora de inicio y fin',
        time_help: 'Hora de inicio y hora de fin (de izquierda a derecha)',
        nap: 'Siesta',
        duration: 'Duración (minutos)',
        notes: 'Notas',
        tags: 'Etiquetas',
        submit: 'Agregar sueño',
        submitting: 'Enviando...',
        cancel: 'Cancelar'
      },
      notifications: {
        success: 'Sueño registrado exitosamente!',
        error: 'Error: {error}'
      },
      config: {
        title: 'Título de la tarjeta',
        button_text: 'Texto del botón',
        device_id: 'Dispositivo bebé',
        default_nap: 'Siesta predeterminada',
        default_duration: 'Duración predeterminada (minutos)',
        show_notes: 'Mostrar campo de notas',
        tags: 'Etiquetas disponibles',
        tags_helper: 'Ingrese nombres de etiquetas (uno por línea) que aparecerán como botones de alternancia en el formulario'
      },
      sections: {
        defaults: 'Valores predeterminados',
        notes_tags: 'Notas & Etiquetas'
      }
    },
    growth: {
      card: {
        title: 'Agregar medición',
        button_text: 'Registrar medición'
      },
      form: {
        type: 'Tipo de medición',
        date: 'Fecha',
        value_weight: 'Peso (kg)',
        value_height: 'Altura (cm)',
        value_head: 'Circunferencia de la cabeza (cm)',
        notes: 'Notas',
        tags: 'Etiquetas',
        submit: 'Agregar medición',
        submitting: 'Enviando...',
        cancel: 'Cancelar'
      },
      types: {
        weight: 'Peso',
        height: 'Altura',
        head: 'Circunferencia de la cabeza'
      },
      notifications: {
        success: '¡Medición registrada correctamente!',
        error: 'Error: {error}'
      },
      config: {
        title: 'Título de la tarjeta',
        button_text: 'Texto del botón',
        device_id: 'Dispositivo bebé',
        default_type: 'Tipo de medición predeterminado',
        show_notes: 'Mostrar campo de notas',
        tags: 'Etiquetas disponibles',
        tags_helper: 'Ingrese nombres de etiquetas (uno por línea) que aparecerán como botones'
      },
      sections: {
        defaults: 'Valores predeterminados',
        notes_tags: 'Notas & Etiquetas'
      }
    },
    note: {
      card: {
        title: 'Add Note',
        button_text: 'Add Note'
      },
      form: {
        time: 'Time',
        note: 'Note',
        note_placeholder: 'Write your note…',
        tags: 'Tags',
        submit: 'Add Note',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      notifications: {
        success: 'Note added successfully!',
        error: 'Error: {error}'
      },
      sections: {
        options: 'Options'
      },
      config: {
        title: 'Card Title',
        button_text: 'Button Text',
        device_id: 'Baby Device',
        show_time: 'Show Time Picker',
        tags: 'Available Tags'
      },
      config_helper: {
        tags: 'These tags will be selectable when adding a note'
      }
    },
    timeline: {
      labels: {
        left: 'Pecho izquierdo',
        right: 'Pecho derecho',
        both: 'Ambos pechos',
        bottle: 'Biberón',
        other: 'Otro',
        solid_food: 'Alimentos sólidos',
        wet: 'Mojado',
        solid: 'Sólido',
        dry: 'Seco'
      },
      config: {
        feedings_entity: 'Entidad alimentaciones',
        diaper_entity: 'Entidad pañales',
        label_left: 'Etiqueta izquierda',
        label_right: 'Etiqueta derecha',
        label_both: 'Etiqueta ambos pechos',
        label_bottle: 'Etiqueta biberón',
        label_other: 'Etiqueta otro',
        label_feed_solid: 'Etiqueta alimentos sólidos',
        color_left: 'Color izquierda',
        color_right: 'Color derecha',
        color_both: 'Color ambos pechos',
        color_bottle: 'Color biberón',
        color_other: 'Color otro',
        color_feed_solid: 'Color alimentos sólidos',
        label_wet: 'Etiqueta mojado',
        label_solid: 'Etiqueta sólido',
        label_dry: 'Etiqueta seco',
        color_wet: 'Color mojado',
        color_solid: 'Color sólido',
        color_dry: 'Color seco',
        offsets: 'Offsets',
        offset_labels: 'Etiquetas de offset',
        compare_as_rows: 'Comparar como filas',
        force_midnight: 'Forzar medianoche eje X',
        height: 'Altura del gráfico',
        disable_scroll_zoom: 'Desactivar zoom con rueda',
        tooltip_update_debounce_ms: 'Debounce de actualizaciones mientras el tooltip es visible (ms)',
        debug: 'Mostrar info de debug',
        debug: 'Mostrar info de debug',
        feed_labels_section: 'Etiquetas alimentación',
        feed_colors_section: 'Colores alimentación',
        diaper_labels_section: 'Etiquetas pañal',
        diaper_colors_section: 'Colores pañal',
        offsets_section: 'Offsets',
        options_section: 'Opciones'
      },
      config_helper: {
        offsets: 'Ejemplo: [0,1,2] o "0,1,2" o "24h,48h". Unidades: d o h.',
        offset_labels: 'Separados por comas o array JSON. Mapeados por índice a los offsets.',
        disable_scroll_zoom: 'Previene el zoom con rueda del ratón en la tarjeta.',
        tooltip_update_debounce_ms: 'Retrasa el re-renderizado mientras el tooltip está abierto para evitar parpadeo.',
        color_left: 'Introduce un código de color hex (ej: #ff0000)',
        color_right: 'Introduce un código de color hex (ej: #ff0000)',
        color_both: 'Introduce un código de color hex (ej: #ff0000)',
        color_bottle: 'Introduce un código de color hex (ej: #ff0000)',
        color_other: 'Introduce un código de color hex (ej: #ff0000)',
        color_feed_solid: 'Introduce un código de color hex (ej: #ff0000)',
        color_wet: 'Introduce un código de color hex (ej: #ff0000)',
        color_solid: 'Introduce un código de color hex (ej: #ff0000)',
        color_dry: 'Introduce un código de color hex (ej: #ff0000)'
      }
    },
    feedings: {
      title: 'Lactancia',
      subtitle: 'Última semana',
      labels: {
        left: 'izq',
        right: 'der',
        both: 'ambos'
      },
      today: 'hoy',
      yesterday: 'ayer',
      days_ago_fmt: 'hace {n} días',
      feedings_singular: 'alimentación',
      feedings_plural: 'alimentaciones',
      minutes_singular: 'minuto',
      minutes_plural: 'minutos',
      config: {
        entity: 'Sensor de alimentaciones',
        title: 'Título',
        subtitle: 'Subtítulo',
        days: 'Número de días',
        label_left: 'Etiqueta izquierda',
        label_right: 'Etiqueta derecha',
        label_both: 'Etiqueta ambos',
        label_feedings_singular: 'Alimentación (singular)',
        label_feedings_plural: 'Alimentación (plural)',
        label_minutes_singular: 'Minutos (singular)',
        label_minutes_plural: 'Minutos (plural)',
        label_today: 'Etiqueta "Hoy"',
        label_yesterday: 'Etiqueta "Ayer"',
        label_days_ago_fmt: 'Formato "días atrás" ({n} = número)',
        show_minutes: 'Mostrar total de minutos',
        icon: 'Icono (mdi:...)',
        color_left: 'Color izquierda',
        color_right: 'Color derecha',
        color_both: 'Color ambos',
        bar_height: 'Altura de barra',
        debug: 'Mostrar debug'
      }
    }

  },
  sv: {
    diaper: {
      card: {
        title: 'Lägg till blöjbyte',
        button_text: 'Registrera blöjbyte'
      },
      form: {
        time: 'Tid',
        type: 'Typ',
        color: 'Färg',
        amount: 'Mängd',
        notes: 'Anteckningar',
        tags: 'Taggar',
        submit: 'Lägg till',
        submitting: 'Skickar...',
        cancel: 'Avbryt'
      },
      types: {
        wet: 'Vått',
        solid: 'Avföring',
        wet_and_solid: 'Vått och Avföring',
        dry: 'Torrt'
      },
      colors: {
        black: 'Svart',
        brown: 'Brun',
        green: 'Grön',
        yellow: 'Gul'
      },
      notifications: {
        success: 'Blöjbyte registrerat framgångsrikt!',
        error: 'Fel: {error}'
      },
      config: {
        title: 'Korttitel',
        button_text: 'Knapptextt',
        device_id: 'Baby-enhet',
        default_type: 'Standardtyp',
        default_color: 'Standardfärg',
        show_amount: 'Visa mängdfält',
        default_amount: 'Standardmängd',
        show_notes: 'Visa anteckningsfält',
        show_color: 'Visa färgfält',
        tags: 'Tillgängliga taggar',
        tags_helper: 'Ange taggnamn (ett per rad) som visas som växlar i popup-formuläret'
      },
      config_helper: {
        title: 'Anpassad titel för kortet',
        button_text: 'Text för knappen',
        device_id: 'Enhet för barnet',
        default_type: 'Vilken typ som ska väljas som standard',
        default_color: 'Vilken färg som ska väljas som standard',
        show_color: 'Om färgfältet ska visas i formuläret',
        show_amount: 'Visa mängdfält',
        default_amount: 'Standardmängd',
        show_notes: 'Visa anteckningsfält',
        tags: 'Ange taggnamn (ett per rad) som visas som växlar i popup-formuläret'
      },
      sections: {
        defaults: 'Standardvärden',
        optional_fields: 'Valfria fält',
        tags: 'Taggar'
      }
    },
    feeding: {
      card: {
        title: 'Lägg till matning',
        button_text: 'Registrera matning'
      },
      form: {
        start_time: 'Start- och sluttid',
        time_help: 'Starttid och sluttid (från vänster till höger)',
        type: 'Typ',
        method: 'Metod',
        amount: 'Mängd',
        notes: 'Anteckningar',
        tags: 'Taggar',
        submit: 'Lägg till matning',
        submitting: 'Skickar...',
        cancel: 'Avbryt'
      },
      types: {
        breast_milk: 'Modersmjölk',
        formula: 'Formula',
        fortified_breast_milk: 'Berikad modersmjölk',
        solid_food: 'Fast föda'
      },
      methods: {
        bottle: 'Flaska',
        left_breast: 'Vänster bröst',
        right_breast: 'Höger bröst',
        both_breasts: 'Båda brösten',
        parent_fed: 'Föräldramatad',
        self_fed: 'Självmatad'
      },
      notifications: {
        success: 'Matning registrerad framgångsrikt!',
        error: 'Fel: {error}'
      },
      config: {
        title: 'Korttitel',
        button_text: 'Knapptextt',
        device_id: 'Baby-enhet',
        default_type: 'Standardtyp',
        default_method: 'Standardmetod',
        default_duration: 'Standardvaraktighet (minuter)',
        show_amount: 'Visa mängdfält',
        default_amount: 'Standardmängd',
        show_notes: 'Visa anteckningsfält',
        tags: 'Tillgängliga taggar'
      },
      config_helper: {
        title: 'Anpassad titel för kortet',
        button_text: 'Text för knappen',
        device_id: 'Enhet för barnet',
        default_type: 'Vilken typ som ska väljas som standard',
        default_method: 'Vilken metod som ska väljas som standard',
        default_duration: 'Standardvaraktighet i minuter',
        show_amount: 'Visa mängdfält',
        default_amount: 'Standardmängd',
        show_notes: 'Visa anteckningsfält',
        tags: 'Ange taggnamn (ett per rad) som visas som växlar i popup-formuläret'
      },
      sections: {
        defaults: 'Standardvärden',
        optional_fields: 'Valfria fält',
        tags: 'Taggar'
      }
    },
    overview: {
      card: {
        title_diaper: 'Senaste blöjbyten',
        title_feeding: 'Senaste matningarna',
        title_sleep: 'Senaste sömnerna',
        title_sleep_daily: 'Sömn per dag'
      },
      just_now: 'Nu',
      ago: 'sedan',
      no_data: 'Ingen data tillgänglig',
      mode_diaper: 'Blöjbyten',
      mode_feeding: 'Matningar',
      mode_sleep: 'Sömn',
      read_more: 'Läs mer',
      read_less: 'Läs mindre',
      event: {
        diaper: 'Blöjbyte',
        feeding: 'Matning',
        sleep: 'Sömn',
        nap: 'Sovstund'
      },
      stats: {
        of_goal: 'av målet',
      },
      sleep: {
        types: {
          sleep: 'sömntid',
          nap: 'Sovstund'
        }
      },
      config: {
        title: 'Korttitel',
        entity: 'Entitet',
        mode: 'Läge',
        limit: 'Gräns',
        mode_sleep: 'sovtider',
        sleep_target: 'Sömnmål (timmar)',
        days_to_show: 'Antal dagar att visa',
        show_tags: 'Visa taggar',
        show_times: 'Visa tider',
        show_delete: 'Visa radera-knapp',
        relative_times: 'Relativa tider',
        tag_colors: 'Taggfärger',
        babybuddy_base_url: 'Bas-URL för BabyBuddy'
      },
      config_helper: {
        title: 'Anpassad titel för kortet',
        entity: 'Sensor-entitet med results-array',
        mode: 'Visa blöjbyten eller matningar',
        limit: 'Maximalt antal händelser att visa',
        sleep_target: 'Mål för sömn per dag i timmar (endast för sömnöversikt)',
        days_to_show: 'Endast för sömn per dag-läge',
        show_tags: 'Visa taggar för varje händelse',
        show_times: 'Visa tidsstämplar',
        relative_times: 'Visa relativa tider istället för absoluta',
        show_delete: 'Visa en knapp för att radera varje händelse',
        tag_colors: 'Ange färger för taggar i formatet tagg:färg (ett per rad)',
        babybuddy_base_url: 'Ange bas-URL för din BabyBuddy-installation för att aktivera länkning till händelsedetaljer, exempel: https://mybabybuddy.instance'
      }
    },
    sleep: {
      card: {
        title: 'Lägg till sömn',
        button_text: 'Registrera sömn'
      },
      form: {
        start_time: 'Start- och sluttid',
        time_help: 'Starttid och sluttid (från vänster till höger)',
        nap: 'Sovstund',
        duration: 'Varaktighet (minuter)',
        notes: 'Anteckningar',
        notes_placeholder: 'Valfritt fält för anteckningar...',
        tags: 'Taggar',
        submit: 'Lägg till sömn',
        submitting: 'Skickar...',
        cancel: 'Avbryt'
      },
      types: {
        sleep: 'Sömn',
        nap: 'Tupplur'
      },
      nap: {
        no: "Nej",
        yes: "Ja"
      },
      notifications: {
        success: 'Sömn registrerad framgångsrikt!',
        error: 'Fel: {error}'
      },
      config: {
        title: 'Korttitel',
        button_text: 'Knapptext',
        device_id: 'Baby-enhet',
        default_nap: 'Standard sovstund',
        default_duration: 'Standardvaraktighet (minuter)',
        show_notes: 'Visa anteckningsfält',
        tags: 'Tillgängliga taggar'
        },
      config_helper: {
        title: 'Anpassad titel för kortet',
        button_text: 'Text för knappen',
        device_id: 'Enhet för barnet',
        default_nap: 'Om standard är ett sovstund eller inte',
        default_duration: 'Standardvaraktighet i minuter',
        show_notes: 'Visa anteckningsfält',
        tags: 'Ange taggnamn (ett per rad) som visas som växlar i popup-formuläret'
      },
      sections: {
        defaults: 'Standardvärden',
        notes_tags: 'Anteckningar & Taggar'
      }
    },
    growth: {
      card: {
        title: 'Lägg till mätning',
        button_text: 'Registrera mätning'
      },
      form: {
        type: 'Typ av mätning',
        date: 'Datum',
        value_weight: 'Vikt (kg)',
        value_height: 'Längd (cm)',
        value_head: 'Huvudomfång (cm)',
        notes: 'Anteckningar',
        tags: 'Taggar',
        submit: 'Lägg till mätning',
        submitting: 'Skickar...',
        cancel: 'Avbryt'
      },
      types: {
        weight: 'Vikt',
        height: 'Längd',
        head: 'Huvudomfång'
      },
      notifications: {
        success: 'Mätningen registrerades framgångsrikt!',
        error: 'Fel: {error}'
      },
      config: {
        title: 'Korttitel',
        button_text: 'Knapptext',
        device_id: 'Baby-enhet',
        default_type: 'Standardtyp av mätning',
        show_notes: 'Visa anteckningsfält',
        tags: 'Tillgängliga taggar'
      },
      config_helper: {
        title: 'Anpassad titel för kortet',
        button_text: 'Text för knappen',
        device_id: 'Enhet för barnet',
        default_type: 'Vilken typ av mätning som ska väljas som standard',
        show_notes: 'Visa anteckningsfält',
        tags: 'Ange taggnamn (ett per rad) som visas som växlar i popup-formuläret'
      },
      sections: {
        defaults: 'Standardvärden',
        notes_tags: 'Anteckningar & Taggar'
      }
    },
    note: {
      card: {
        title: 'Lägg till anteckning',
        button_text: 'Lägg till anteckning'
      },
      form: {
        time: 'Tid',
        note: 'Anteckning',
        note_placeholder: 'Skriv din anteckning…',
        tags: 'Taggar',
        submit: 'Spara anteckning',
        cancel: 'Avbryt',
        submitting: 'Skickar...'
      },
      notifications: {
        success: 'Anteckningen sparades!',
        error: 'Fel: {error}'
      },
      sections: {
        options: 'Alternativ'
      },
      config: {
        title: 'Korttitel',
        button_text: 'Knapptext',
        device_id: 'Baby-enhet',
        show_time: 'Visa tidsväljare',
        tags: 'Tillgängliga taggar'
      },
      config_helper: {
        title: 'Anpassad titel för kortet',
        button_text: 'Text för knappen',
        device_id: 'Enhet för barnet',
        show_time: 'Om tidsväljaren ska visas när en anteckning skapas',
        tags: 'Dessa taggar kan väljas när en anteckning skapas'
      }
    },
    timeline: {
      labels: {
        left: 'Vänster bröst',
        right: 'Höger bröst',
        both: 'Båda brösten',
        bottle: 'Flaska',
        other: 'Övrigt',
        solid_food: 'Fast föda',
        wet: 'Vått',
        solid: 'Avföring',
        dry: 'Torrt'
      },
      config: {
        feedings_entity: 'Matningar entitet',
        diaper_entity: 'Blöj entitet',
        label_left: 'Etikett vänster',
        label_right: 'Etikett höger',
        label_both: 'Etikett båda brösten',
        label_bottle: 'Etikett flaska',
        label_other: 'Etikett övrigt',
        label_feed_solid: 'Etikett fast föda',
        color_left: 'Färg vänster',
        color_right: 'Färg höger',
        color_both: 'Färg båda brösten',
        color_bottle: 'Färg flaska',
        color_other: 'Färg övrigt',
        color_feed_solid: 'Färg fast föda',
        label_wet: 'Etikett vått',
        label_solid: 'Etikett avföring',
        label_dry: 'Etikett torrt',
        color_wet: 'Färg vått',
        color_solid: 'Färg avföring',
        color_dry: 'Färg torrt',
        offsets: 'Offset',
        offset_labels: 'Offset-etiketter',
        compare_as_rows: 'Jämför som rader',
        force_midnight: 'Tvinga midnatt X-axel',
        height: 'Diagramhöjd',
        disable_scroll_zoom: 'Inaktivera scroll-zoom',
        tooltip_update_debounce_ms: 'Debounce-uppdateringar medan tooltip är synlig (ms)',
        debug: 'Visa debuginfo',
        debug: 'Visa debuginfo',
        feed_labels_section: 'Matningsetiketter',
        feed_colors_section: 'Matningsfärger',
        diaper_labels_section: 'Blöjetiketter',
        diaper_colors_section: 'Blöjefärger',
        offsets_section: 'Offsets',
        options_section: 'Alternativ'
      },
      config_helper: {
        offsets: 'Exempel: [0,1,2] eller "0,1,2" eller "24h,48h". Enheter: d eller h.',
        offset_labels: 'Kommaseparerade eller JSON-array. Mappade per index till offsets.',
        disable_scroll_zoom: 'Förhindrar mushjulszoom i kortet.',
        tooltip_update_debounce_ms: 'Fördröj omrendering medan tooltip är öppen för att undvika flimmer.',
        color_left: 'Ange en hex-färgkod (t.ex. #ff0000)',
        color_right: 'Ange en hex-färgkod (t.ex. #ff0000)',
        color_both: 'Ange en hex-färgkod (t.ex. #ff0000)',
        color_bottle: 'Ange en hex-färgkod (t.ex. #ff0000)',
        color_other: 'Ange en hex-färgkod (t.ex. #ff0000)',
        color_feed_solid: 'Ange en hex-färgkod (t.ex. #ff0000)',
        color_wet: 'Ange en hex-färgkod (t.ex. #ff0000)',
        color_solid: 'Ange en hex-färgkod (t.ex. #ff0000)',
        color_dry: 'Ange en hex-färgkod (t.ex. #ff0000)'
      }
    },
    feedings: {
      title: 'Amning',
      subtitle: 'Senaste veckan',
      labels: {
        left: 'vänster',
        right: 'höger',
        both: 'båda'
      },
      today: 'idag',
      yesterday: 'igår',
      days_ago_fmt: '{n} dagar sedan',
      feedings_singular: 'matning',
      feedings_plural: 'matningar',
      minutes_singular: 'minut',
      minutes_plural: 'minuter',
      config: {
        entity: 'Matningssensor',
        title: 'Titel',
        subtitle: 'Undertitel',
        days: 'Antal dagar',
        label_left: 'Etikett vänster',
        label_right: 'Etikett höger',
        label_both: 'Etikett båda',
        label_feedings_singular: 'Matning (singular)',
        label_feedings_plural: 'Matning (plural)',
        label_minutes_singular: 'Minuter (singular)',
        label_minutes_plural: 'Minuter (plural)',
        label_today: '"Idag"-etikett',
        label_yesterday: '"Igår"-etikett',
        label_days_ago_fmt: '"Dagar sedan"-format ({n} = antal)',
        show_minutes: 'Visa totalt antal minuter',
        icon: 'Ikon (mdi:...)',
        color_left: 'Färg vänster',
        color_right: 'Färg höger',
        color_both: 'Färg båda',
        bar_height: 'Stapelhöjd',
        debug: 'Visa debug'
      }
    }

  }
  };

// Utility function to get translation
function getTranslation(language, path, replacements = {}) {
  const translations = BabyBuddyTranslations[language] || BabyBuddyTranslations['en'];
  const keys = path.split('.');
  let value = translations;
  
  for (const key of keys) {
    value = value?.[key];
    if (!value) break;
  }
  
  let text = value || path;
  for (const [key, val] of Object.entries(replacements)) {
    text = text.replace(`{${key}}`, val);
  }
  
  return text;
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
  window.BabyBuddyTranslations = BabyBuddyTranslations;
  window.getTranslation = getTranslation;
}
