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
    }
  },
  fr: {
    diaper: {
      card: {
        title: 'Ajouter un changement de couche',
        button_text: 'Enregistrer la couche'
      },
      form: {
        time: 'Heure',
        type: 'Type',
        color: 'Couleur',
        amount: 'Montant',
        notes: 'Notes',
        tags: 'Tags',
        submit: 'Ajouter',
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
        title_feeding: 'Senaste matningarna'
      },
      just_now: 'Nu',
      ago: 'sedan',
      no_data: 'Ingen data tillgänglig',
      mode_diaper: 'Blöjbyten',
      mode_feeding: 'Matningar',
      config: {
        title: 'Korttitel',
        entity: 'Entitet',
        mode: 'Läge',
        limit: 'Gräns',
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
        cancel: 'Avbryt'
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
        tags: 'Tillgängliga taggar',
        tags_helper: 'Ange taggnamn (ett per rad) som visas som växlar i popup-formuläret'
      },
      sections: {
        defaults: 'Standardvärden',
        notes_tags: 'Anteckningar & Taggar'
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
