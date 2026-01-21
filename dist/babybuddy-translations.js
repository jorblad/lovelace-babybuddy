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
        wet_and_solid: 'Wet and Solid'
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
        wet_and_solid: 'Nat en Ontlasting'
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
        wet_and_solid: 'Nass und Fest'
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
        wet_and_solid: 'Mouillé et Solide'
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
        wet_and_solid: 'Mojado y Sólido'
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
    }
  },
  sv: {
    diaper: {
      card: {
        title: 'Lägg till blöjbyte',
        button_text: 'Registrera blöja'
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
        wet_and_solid: 'Vått och Avföring'
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
        tags: 'Tillgängliga taggar',
        tags_helper: 'Ange taggnamn (ett per rad) som visas som växlar i popup-formuläret'
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
        tags: 'Tillgängliga taggar',
        tags_helper: 'Ange taggnamn (ett per rad) som visas som växlar i popup-formuläret'
      },
      sections: {
        defaults: 'Standardvärden',
        optional_fields: 'Valfria fält',
        tags: 'Taggar'
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
