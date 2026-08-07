export type Locale = 'nl' | 'en'

export const translations = {
  nl: {
    // Navigation
    nav_plan:      'Plannen',
    nav_tags:      'Tags',
    nav_leftovers: 'Kliekjes',
    nav_pantry:    'Voorraad',
    nav_saved:     'Opgeslagen',
    nav_language:  'English',
    nav_language_flag: '🇬🇧',

    // Days
    day_monday:    'Maandag',
    day_tuesday:   'Dinsdag',
    day_wednesday: 'Woensdag',
    day_thursday:  'Donderdag',
    day_friday:    'Vrijdag',
    day_saturday:  'Zaterdag',
    day_sunday:    'Zondag',
    day_short_monday:    'Ma',
    day_short_tuesday:   'Di',
    day_short_wednesday: 'Wo',
    day_short_thursday:  'Do',
    day_short_friday:    'Vr',
    day_short_saturday:  'Za',
    day_short_sunday:    'Zo',

    // Home page
    home_heading_people:  'Hoeveel mensen eten er mee?',
    home_sub_people:      'Selecteer per dag het aantal personen.',
    home_heading_tags:    'Dieetwensen & voorkeuren',
    home_sub_tags:        'Schakel tags in voor de hele week of per dag.',
    home_avg_label:       'Totaal aantal porties',
    home_avg_unit:        'porties',
    home_meals_label:     'Maaltijden te plannen',
    home_meals_unit:      'dagen',
    home_meals_full_week: 'ma t/m zo',
    home_filters_label:   'Actieve filters',
    home_filters_none:    'Geen beperkingen',
    home_filters_set:     'ingesteld',
    home_next_btn:        'Volgende stap →',
    home_next_sub:        'De AI controleert je kliekjes & eetgeschiedenis voor je bevestigt.',

    // PeoplePicker
    people_persons_label: 'personen op',

    // TagSelector
    tag_all_week:    'Standaard hele week',
    tag_active_on:   'Standaard actief op:',
    tag_new_btn:     '+ Nieuwe tag aanmaken',
    tag_name_ph:     'Naam (bijv. Nootvrij)',
    tag_snippet_ph:  'Prompt instructie (bijv. Geen noten of notenproducten.)',
    tag_add:         'Toevoegen',
    tag_cancel:      'Annuleer',
    tag_loading:     'Tags laden...',
    tag_whole_week:  'hele week',

    // Planning page
    planning_loading_title: 'AI is aan het nadenken...',
    planning_loading_sub:   'Kliekjes en eetgeschiedenis worden gescand',

    // Auditor review
    auditor_heading:    'Kliekjes inplannen',
    auditor_sub:        'De AI heeft deze kliekjes gevonden. Selecteer wat je deze week wil gebruiken.',
    auditor_empty_icon: '🍲',
    auditor_empty_title:'Geen kliekjes gevonden',
    auditor_empty_sub:  'Voeg kliekjes toe via het Kliekjes-menu om ze in te plannen.',
    auditor_generate:   'Genereer weekmenu →',
    auditor_selected:   'geselecteerd',
    auditor_of:         'van',
    auditor_suggested:  'Voorgesteld voor:',

    // Result page
    result_heading:     'Jouw weekmenu',
    result_sub:         'Gegenereerd door Claude',
    result_loading_title:'Weekmenu wordt gegenereerd...',
    result_loading_sub: 'Even geduld, dit duurt 15–30 seconden',
    result_save:        'Opslaan',
    result_saved:       '✓ Opgeslagen',
    result_save_ph:     'Naam voor dit menu',
    result_saving:      'Bezig...',
    result_restart:     'Opnieuw beginnen',
    result_cancel:      'Annuleer',
    result_menu_heading:'Weekmenu',
    result_shop_heading:'Boodschappenlijst',
    result_copy:        'Kopieer',
    result_copied:      '✓ Gekopieerd',

    // Shopping list
    shop_persons:   'personen',

    // Manage: Tags
    manage_tags_title:   'Tags',
    manage_tags_sub:     'Tags zijn instructies die meegegeven worden aan de AI bij het genereren van je weekmenu. Elke tag heeft een prompt snippet, een korte zin die vertelt wat de AI wel of niet mag doen. Je kunt hier ook instellen welke tags standaard actief zijn als je begint met plannen.',
    manage_tags_new:     'Nieuwe tag',
    manage_tags_name_ph: 'Naam',
    manage_tags_snip_ph: 'Prompt instructie (bijv. Gebruik niet de volgende ingrediënten: ...)',
    manage_tags_add:     'Toevoegen',
    manage_tags_edit:    'Bewerk',
    manage_tags_delete:  'Verwijder',
    manage_tags_save:    'Opslaan',
    manage_tags_cancel:  'Annuleer',
    manage_tags_all_week:'Standaard hele week',
    manage_tags_active:  'Standaard actief op:',

    // Manage: Kliekjes
    manage_kl_title:     'Kliekjes',
    manage_kl_empty:     'Geen kliekjes gevonden.',
    manage_kl_add:       'Kliekje toevoegen',
    manage_kl_name_ph:   'Naam (bijv. Stoofvlees, Soep)',
    manage_kl_portions:  'Porties',
    manage_kl_date:      'Datum ingevroren',
    manage_kl_delete:    'Verwijder',
    manage_kl_portions_unit: 'port.',

    // Manage: Voorraad
    manage_pantry_title: 'Basisvoorraad',
    manage_pantry_sub:   'De AI gaat ervan uit dat alles wat je hier toevoegt al in huis is. Het wordt gebruikt in recepten maar staat niet op je boodschappenlijst.',
    manage_pantry_empty: 'Nog geen items.',
    manage_pantry_unit_ph: 'Eenheid',
    manage_pantry_delete:'Verwijder',
    manage_pantry_std:   'Standaardvoorraad',
    manage_pantry_fridge:'Koelkast',
    manage_pantry_freezer:'Vriezer',
    manage_pantry_cupboard:'Voorraadkast',

    // Saved menus
    saved_title:         'Opgeslagen menu\'s',
    saved_empty_title:   'Nog geen opgeslagen menu\'s',
    saved_empty_sub:     'Genereer een weekmenu en sla het op via de resultaatpagina.',
    saved_load:          'Laden',
    saved_delete:        'Verwijder',
    saved_back:          '← Terug naar lijst',
    saved_rescale_to:    'Herschalen naar',
    saved_rescale_unit:  'personen',
    saved_rescale_btn:   'Herschalen',
    saved_rescale_reset: 'Origineel herstellen',
    saved_rescaled_msg:  'Boodschappenlijst herschaald van',
    saved_rescaled_to:   'naar',
    saved_rescaled_unit: 'personen.',

    // Error
    error_title:  'oopsie woopsie dat is stukkie wukkie',
    error_retry:  'Probeer opnieuw',
  },

  en: {
    // Navigation
    nav_plan:      'Plan',
    nav_tags:      'Tags',
    nav_leftovers: 'Leftovers',
    nav_pantry:    'Pantry',
    nav_saved:     'Saved',
    nav_language:  'Nederlands',
    nav_language_flag: '🇳🇱',

    // Days
    day_monday:    'Monday',
    day_tuesday:   'Tuesday',
    day_wednesday: 'Wednesday',
    day_thursday:  'Thursday',
    day_friday:    'Friday',
    day_saturday:  'Saturday',
    day_sunday:    'Sunday',
    day_short_monday:    'Mo',
    day_short_tuesday:   'Tu',
    day_short_wednesday: 'We',
    day_short_thursday:  'Th',
    day_short_friday:    'Fr',
    day_short_saturday:  'Sa',
    day_short_sunday:    'Su',

    // Home page
    home_heading_people:  'How many people are eating?',
    home_sub_people:      'Set the number of diners per day.',
    home_heading_tags:    'Dietary preferences',
    home_sub_tags:        'Enable tags for the whole week or per day.',
    home_avg_label:       'Total portions',
    home_avg_unit:        'portions',
    home_meals_label:     'Meals to plan',
    home_meals_unit:      'days',
    home_meals_full_week: 'Mon–Sun',
    home_filters_label:   'Active filters',
    home_filters_none:    'No restrictions',
    home_filters_set:     'set',
    home_next_btn:        'Next step →',
    home_next_sub:        'The AI will check your leftovers & meal history before you confirm.',

    // PeoplePicker
    people_persons_label: 'persons on',

    // TagSelector
    tag_all_week:    'Default all week',
    tag_active_on:   'Default active on:',
    tag_new_btn:     '+ Create new tag',
    tag_name_ph:     'Name (e.g. Nut-free)',
    tag_snippet_ph:  'Prompt instruction (e.g. No nuts or nut products.)',
    tag_add:         'Add',
    tag_cancel:      'Cancel',
    tag_loading:     'Loading tags...',
    tag_whole_week:  'all week',

    // Planning page
    planning_loading_title: 'AI is thinking...',
    planning_loading_sub:   'Scanning leftovers and meal history',

    // Auditor review
    auditor_heading:    'Plan your leftovers',
    auditor_sub:        'The AI found these leftovers. Select what you want to use this week.',
    auditor_empty_icon: '🍲',
    auditor_empty_title:'No leftovers found',
    auditor_empty_sub:  'Add leftovers via the Leftovers menu to plan them in.',
    auditor_generate:   'Generate meal plan →',
    auditor_selected:   'selected',
    auditor_of:         'of',
    auditor_suggested:  'Suggested for:',

    // Result page
    result_heading:     'Your weekly menu',
    result_sub:         'Generated by Claude',
    result_loading_title:'Generating meal plan...',
    result_loading_sub: 'Please wait, this takes 15–30 seconds',
    result_save:        'Save',
    result_saved:       '✓ Saved',
    result_save_ph:     'Name for this menu',
    result_saving:      'Saving...',
    result_restart:     'Start over',
    result_cancel:      'Cancel',
    result_menu_heading:'Weekly menu',
    result_shop_heading:'Shopping list',
    result_copy:        'Copy',
    result_copied:      '✓ Copied',

    // Shopping list
    shop_persons:   'persons',

    // Manage: Tags
    manage_tags_title:   'Tags',
    manage_tags_sub:     'Tags are instructions passed to the AI when generating your meal plan. Each tag has a prompt snippet — a short sentence telling the AI what it may or may not do. You can also set which tags are active by default when you start planning.',
    manage_tags_new:     'New tag',
    manage_tags_name_ph: 'Name',
    manage_tags_snip_ph: 'Prompt instruction (e.g. Do not use the following ingredients: ...)',
    manage_tags_add:     'Add',
    manage_tags_edit:    'Edit',
    manage_tags_delete:  'Delete',
    manage_tags_save:    'Save',
    manage_tags_cancel:  'Cancel',
    manage_tags_all_week:'Default all week',
    manage_tags_active:  'Default active on:',

    // Manage: Leftovers
    manage_kl_title:     'Leftovers',
    manage_kl_empty:     'No leftovers found.',
    manage_kl_add:       'Add leftover',
    manage_kl_name_ph:   'Name (e.g. Stew, Soup)',
    manage_kl_portions:  'Portions',
    manage_kl_date:      'Date frozen',
    manage_kl_delete:    'Delete',
    manage_kl_portions_unit: 'port.',

    // Manage: Pantry
    manage_pantry_title: 'Pantry',
    manage_pantry_sub:   'The AI assumes everything you add here is always in stock. It will use these in recipes but never put them on the shopping list.',
    manage_pantry_empty: 'No items yet.',
    manage_pantry_unit_ph: 'Unit',
    manage_pantry_delete:'Delete',
    manage_pantry_std:   'Staples',
    manage_pantry_fridge:'Fridge',
    manage_pantry_freezer:'Freezer',
    manage_pantry_cupboard:'Cupboard',

    // Saved menus
    saved_title:         'Saved menus',
    saved_empty_title:   'No saved menus yet',
    saved_empty_sub:     'Generate a meal plan and save it from the result page.',
    saved_load:          'Load',
    saved_delete:        'Delete',
    saved_back:          '← Back to list',
    saved_rescale_to:    'Rescale to',
    saved_rescale_unit:  'persons',
    saved_rescale_btn:   'Rescale',
    saved_rescale_reset: 'Reset to original',
    saved_rescaled_msg:  'Shopping list rescaled from',
    saved_rescaled_to:   'to',
    saved_rescaled_unit: 'persons.',

    // Error
    error_title:  'oopsie woopsie that is brokkie wokkie',
    error_retry:  'Try again',
  },
} as const

export type TranslationKey = keyof typeof translations['nl']

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key]
}
