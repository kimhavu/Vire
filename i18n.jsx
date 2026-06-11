/* Vire-app — kielipaketit (FI / EN / SV) + t()-apuri.
   Avaimet ryhmittäin; jokaisen avaimen kolme kieltä vierekkäin. */

const STR = {
  /* yleiset */
  back:        { fi: "Takaisin", en: "Back", sv: "Tillbaka" },
  cancel:      { fi: "Peruuta", en: "Cancel", sv: "Avbryt" },
  save:        { fi: "Tallenna", en: "Save", sv: "Spara" },
  add:         { fi: "Lisää", en: "Add", sv: "Lägg till" },
  continue:    { fi: "Jatka", en: "Continue", sv: "Fortsätt" },
  optional:    { fi: "vapaaehtoinen", en: "optional", sv: "valfritt" },
  done:        { fi: "Valmis", en: "Done", sv: "Klar" },

  /* brändi / splash */
  tagline:     { fi: "Hyvässä vireessä, joka päivä", en: "In good shape, every day", sv: "I god form, varje dag" },

  /* navigaatio */
  nav_today:   { fi: "Tänään", en: "Today", sv: "Idag" },
  nav_move:    { fi: "Liike", en: "Move", sv: "Rörelse" },
  nav_food:    { fi: "Ravinto", en: "Nutrition", sv: "Näring" },
  nav_profile: { fi: "Profiili", en: "Profile", sv: "Profil" },
  nav_home:    { fi: "Koti", en: "Home", sv: "Hem" },
  nav_workouts:{ fi: "Harjoitteet", en: "Workouts", sv: "Pass" },
  nav_week:    { fi: "Viikko-ohjelma", en: "Week plan", sv: "Veckoprogram" },
  nav_overview:{ fi: "Yleisnäkymä", en: "Overview", sv: "Översikt" },
  nav_diary:   { fi: "Ruokapäiväkirja", en: "Food diary", sv: "Matdagbok" },

  /* käyttöönotto */
  ob_welcome_t: { fi: "Tervetuloa Vireeseen", en: "Welcome to Vire", sv: "Välkommen till Vire" },
  ob_welcome_b: { fi: "Lempeä kumppani ravinnolle ja liikkeelle. Aloitetaan rauhassa — sinun tahtiisi.", en: "A gentle companion for nutrition and movement. Let's start calmly — at your own pace.", sv: "En mjuk följeslagare för kost och rörelse. Vi börjar lugnt — i din egen takt." },
  ob_start:     { fi: "Aloitetaan", en: "Get started", sv: "Kom igång" },
  ob_step:      { fi: "Vaihe", en: "Step", sv: "Steg" },
  ob_name_t:    { fi: "Mikä on nimesi?", en: "What's your name?", sv: "Vad heter du?" },
  ob_name_s:    { fi: "Tervehdimme sinua tällä etusivulla.", en: "We'll greet you on the home screen.", sv: "Vi hälsar dig på startsidan." },
  ob_firstname: { fi: "Etunimi", en: "First name", sv: "Förnamn" },
  ob_name_ph:   { fi: "Esim. Aino", en: "E.g. Aino", sv: "T.ex. Aino" },
  ob_goals_t:   { fi: "Päivätavoitteesi", en: "Your daily goals", sv: "Dina dagsmål" },
  ob_goals_s:   { fi: "Voit muuttaa näitä myöhemmin profiilista.", en: "You can change these later in your profile.", sv: "Du kan ändra dessa senare i profilen." },
  ob_start_use: { fi: "Aloita käyttö", en: "Start using", sv: "Börja använda" },

  /* tavoitteet / yksiköt */
  goal_steps:   { fi: "Askeleet", en: "Steps", sv: "Steg" },
  goal_energy:  { fi: "Energia", en: "Energy", sv: "Energi" },
  goal_active:  { fi: "Liikeminuutit", en: "Active minutes", sv: "Aktiva minuter" },
  goal_water:   { fi: "Vesi", en: "Water", sv: "Vatten" },
  u_steps:      { fi: "askelta", en: "steps", sv: "steg" },
  u_kcal:       { fi: "kcal", en: "kcal", sv: "kcal" },
  u_min:        { fi: "min", en: "min", sv: "min" },
  u_glasses:    { fi: "lasia", en: "glasses", sv: "glas" },

  /* etusivu */
  greet_morning:{ fi: "Hyvää huomenta", en: "Good morning", sv: "God morgon" },
  greet_day:    { fi: "Hei", en: "Hi", sv: "Hej" },
  greet_evening:{ fi: "Hyvää iltaa", en: "Good evening", sv: "God kväll" },
  day_goals:    { fi: "Päivän tavoitteet", en: "Today's goals", sv: "Dagens mål" },
  start_logging:{ fi: "Aloita kirjaaminen", en: "Start logging", sv: "Börja logga" },
  in_good_vire: { fi: "Hyvässä vireessä", en: "In good shape", sv: "I god form" },
  add_steps_t:  { fi: "Askeleet", en: "Steps", sv: "Steg" },
  add_manually: { fi: "Lisää käsin tai aseta koko luku", en: "Add manually or set the total", sv: "Lägg till manuellt eller ange totalen" },
  set_value:    { fi: "Aseta luku…", en: "Set value…", sv: "Ange värde…" },
  set_btn:      { fi: "Aseta", en: "Set", sv: "Ange" },
  steps_note:   { fi: "Lopullisessa sovelluksessa askeleet luetaan puhelimen liikeanturista (Apple Health / Google Fit). Pilotissa kirjaat ne itse.", en: "In the final app, steps are read from your phone's motion sensor (Apple Health / Google Fit). In the pilot you log them yourself.", sv: "I den färdiga appen läses steg från telefonens rörelsesensor (Apple Health / Google Fit). I piloten loggar du dem själv." },
  fresh_start:  { fi: "Tämä on tuore alku. Kirjaa ensimmäinen ateria tai askeleet — rakennat tavan pala kerrallaan.", en: "This is a fresh start. Log your first meal or steps — you build the habit piece by piece.", sv: "Detta är en ny början. Logga din första måltid eller dina steg — du bygger vanan bit för bit." },
  todays_meals: { fi: "Päivän ateriat", en: "Today's meals", sv: "Dagens måltider" },
  todays_workouts: { fi: "Päivän harjoitukset", en: "Today's workouts", sv: "Dagens pass" },
  no_meals_today: { fi: "Et ole vielä kirjannut aterioita", en: "You haven't logged any meals yet", sv: "Du har inte loggat några måltider än" },
  no_workouts_today: { fi: "Et ole vielä kirjannut harjoituksia", en: "You haven't logged any workouts yet", sv: "Du har inte loggat några pass än" },
  view_all:     { fi: "Näytä kaikki", en: "View all", sv: "Visa alla" },

  /* fiilis */
  mood_title:   { fi: "Päivän yleisfiilis", en: "Today's overall mood", sv: "Dagens allmänna känsla" },
  mood_sub:     { fi: "Miltä tänään tuntuu?", en: "How do you feel today?", sv: "Hur känns det idag?" },
  mood_pick:    { fi: "Valitse fiilis", en: "Pick a mood", sv: "Välj känsla" },
  mood_great:   { fi: "Loistava", en: "Great", sv: "Toppen" },
  mood_good:    { fi: "Hyvä", en: "Good", sv: "Bra" },
  mood_even:    { fi: "Tasainen", en: "Even", sv: "Jämn" },
  mood_tired:   { fi: "Väsynyt", en: "Tired", sv: "Trött" },
  mood_stressed:{ fi: "Stressaantunut", en: "Stressed", sv: "Stressad" },
  mood_history: { fi: "Viime päivät", en: "Recent days", sv: "Senaste dagarna" },

  /* liike */
  move_title:   { fi: "Harjoitteet", en: "Workouts", sv: "Pass" },
  log_btn:      { fi: "Kirjaa", en: "Log", sv: "Logga" },
  no_entries:   { fi: "Ei merkintöjä", en: "No entries", sv: "Inga poster" },
  log_workout_body: { fi: "Kirjaa tämän päivän liike — kävely, treeni, mitä vain.", en: "Log today's movement — a walk, a workout, anything.", sv: "Logga dagens rörelse — en promenad, ett pass, vad som helst." },
  log_workout:  { fi: "Kirjaa harjoitus", en: "Log workout", sv: "Logga pass" },
  new_workout:  { fi: "Uusi harjoitus", en: "New workout", sv: "Nytt pass" },
  what_did_you_do: { fi: "Mitä teit?", en: "What did you do?", sv: "Vad gjorde du?" },
  workout_ph:   { fi: "Esim. Aamukävely, kuntosali…", en: "E.g. Morning walk, gym…", sv: "T.ex. Morgonpromenad, gym…" },
  dur_min:      { fi: "Kesto (min)", en: "Duration (min)", sv: "Längd (min)" },
  energy_kcal:  { fi: "Energia (kcal)", en: "Energy (kcal)", sv: "Energi (kcal)" },
  workouts_today_n: { fi: "harjoitusta tänään", en: "workouts today", sv: "pass idag" },
  logged_badge: { fi: "Kirjattu", en: "Logged", sv: "Loggat" },
  planned_workouts: { fi: "Suunnitellut harjoitteet", en: "Planned workouts", sv: "Planerade pass" },
  sample_note:  { fi: "Esimerkki — personoitu treeniohjelma ja ohjevideot tulevat tähän, kun ne on lisätty.", en: "Sample — your personalised programme and instructional videos appear here once added.", sv: "Exempel — ditt personliga program och instruktionsvideor visas här när de lagts till." },
  watch_technique: { fi: "Katso tekniikka", en: "Watch technique", sv: "Se teknik" },
  my_workouts:  { fi: "Omat kirjaukset", en: "My entries", sv: "Mina poster" },
  week_plan_t:  { fi: "Viikko-ohjelma", en: "Week plan", sv: "Veckoprogram" },
  week_w:       { fi: "Viikko", en: "Week", sv: "Vecka" },
  active_days:  { fi: "aktiivista pv", en: "active days", sv: "aktiva dgr" },
  min_total:    { fi: "min yhteensä", en: "min total", sv: "min totalt" },
  workouts_count: { fi: "harjoitusta", en: "workouts", sv: "pass" },
  week_note:    { fi: "Personoitu viikko-ohjelma näkyy tässä, kun se on laadittu. Nyt näet omat kirjauksesi.", en: "Your personalised week plan appears here once created. For now you see your own entries.", sv: "Ditt personliga veckoprogram visas här när det skapats. Nu ser du dina egna poster." },

  /* ravinto */
  food_title:   { fi: "Ravinto", en: "Nutrition", sv: "Näring" },
  remaining:    { fi: "Jäljellä tänään", en: "Remaining today", sv: "Kvar idag" },
  good_balance: { fi: "Hyvä tasapaino", en: "Good balance", sv: "Bra balans" },
  no_logs_yet:  { fi: "Ei vielä kirjauksia", en: "No logs yet", sv: "Inga loggar än" },
  not_logged:   { fi: "Ei kirjattu", en: "Not logged", sv: "Inte loggat" },
  entries_n:    { fi: "merkintää", en: "entries", sv: "poster" },
  open_diary:   { fi: "Avaa ruokapäiväkirja", en: "Open food diary", sv: "Öppna matdagbok" },
  write_self:   { fi: "Kirjoita itse", en: "Write your own", sv: "Skriv själv" },
  meal_ph:      { fi: "Mitä söit? Esim. kaurapuuro, marjat ja kahvi…", en: "What did you eat? E.g. oatmeal, berries and coffee…", sv: "Vad åt du? T.ex. havregröt, bär och kaffe…" },
  choose_menu:  { fi: "Valitse valikosta", en: "Choose from menu", sv: "Välj från menyn" },
  no_meals_slot:{ fi: "Et ole vielä kirjannut aterioita", en: "You haven't logged any meals yet", sv: "Du har inte loggat några måltider än" },
  logged_label: { fi: "kirjattu", en: "logged", sv: "loggat" },
  menu_note:    { fi: "Oma ravinto-ohjelma korvaa tämän valikon, kun se on laadittu.", en: "Your nutrition plan replaces this menu once created.", sv: "Ditt näringsprogram ersätter denna meny när det skapats." },
  meal_breakfast: { fi: "Aamiainen", en: "Breakfast", sv: "Frukost" },
  meal_lunch:   { fi: "Lounas", en: "Lunch", sv: "Lunch" },
  meal_snack:   { fi: "Välipala", en: "Snack", sv: "Mellanmål" },
  meal_dinner:  { fi: "Päivällinen", en: "Dinner", sv: "Middag" },

  /* profiili */
  profile_t:    { fi: "Profiili", en: "Profile", sv: "Profil" },
  pilot_user:   { fi: "Pilottikäyttäjä", en: "Pilot user", sv: "Pilotanvändare" },
  member_days:  { fi: "Mukana {n} päivää", en: "Member for {n} days", sv: "Medlem i {n} dagar" },
  st_meals:     { fi: "ateriaa", en: "meals", sv: "måltider" },
  st_workouts:  { fi: "liikettä", en: "workouts", sv: "pass" },
  st_active:    { fi: "aktiivista pv", en: "active days", sv: "aktiva dgr" },
  goals_section:{ fi: "Tavoitteet", en: "Goals", sv: "Mål" },
  goal_steps_l: { fi: "Askeltavoite", en: "Step goal", sv: "Stegmål" },
  goal_energy_l:{ fi: "Energiatavoite", en: "Energy goal", sv: "Energimål" },
  menu_section: { fi: "Valikko", en: "Menu", sv: "Meny" },
  m_myinfo:     { fi: "Omat tiedot", en: "My details", sv: "Mina uppgifter" },
  m_trainhist:  { fi: "Treenihistoria", en: "Training history", sv: "Träningshistorik" },
  m_foodhist:   { fi: "Ravintohistoria", en: "Nutrition history", sv: "Näringshistorik" },
  m_notif:      { fi: "Ilmoitukset", en: "Notifications", sv: "Aviseringar" },
  m_settings:   { fi: "Asetukset", en: "Settings", sv: "Inställningar" },
  m_logout:     { fi: "Kirjaudu ulos", en: "Log out", sv: "Logga ut" },
  change_photo: { fi: "Vaihda kuva", en: "Change photo", sv: "Byt bild" },
  version:      { fi: "Versio", en: "Version", sv: "Version" },
  data_note:    { fi: "tiedot tallennetaan vain tähän laitteeseen", en: "data is stored only on this device", sv: "data sparas endast på denna enhet" },
  logout_confirm: { fi: "Haluatko kirjautua ulos? Tämä nollaa profiilin ja kaikki kirjaukset tästä laitteesta.", en: "Log out? This resets your profile and all entries on this device.", sv: "Logga ut? Detta nollställer profilen och alla poster på denna enhet." },
  logout_yes:   { fi: "Kyllä, kirjaudu ulos", en: "Yes, log out", sv: "Ja, logga ut" },

  /* omat tiedot */
  myinfo_t:     { fi: "Omat tiedot", en: "My details", sv: "Mina uppgifter" },
  field_name:   { fi: "Nimi", en: "Name", sv: "Namn" },
  field_email:  { fi: "Sähköposti", en: "Email", sv: "E-post" },
  field_age:    { fi: "Ikä", en: "Age", sv: "Ålder" },
  field_height: { fi: "Pituus (cm)", en: "Height (cm)", sv: "Längd (cm)" },
  field_weight: { fi: "Paino (kg)", en: "Weight (kg)", sv: "Vikt (kg)" },
  myinfo_note:  { fi: "Tietoja käytetään tavoitteiden tarkentamiseen. Ne tallennetaan vain tähän laitteeseen.", en: "Used to refine your goals. Stored only on this device.", sv: "Används för att förfina dina mål. Sparas endast på denna enhet." },
  saved_ok:     { fi: "Tallennettu", en: "Saved", sv: "Sparat" },

  /* historia */
  range_week:   { fi: "Viikko", en: "Week", sv: "Vecka" },
  range_6mo:    { fi: "6 kk", en: "6 mo", sv: "6 mån" },
  range_year:   { fi: "Vuosi", en: "Year", sv: "År" },
  trainhist_t:  { fi: "Treenihistoria", en: "Training history", sv: "Träningshistorik" },
  foodhist_t:   { fi: "Ravintohistoria", en: "Nutrition history", sv: "Näringshistorik" },
  workouts_label: { fi: "Harjoitukset", en: "Workouts", sv: "Pass" },
  activemin_label:{ fi: "Liikeminuutit", en: "Active minutes", sv: "Aktiva minuter" },
  energy_label: { fi: "Energia", en: "Energy", sv: "Energi" },
  avg_label:    { fi: "keskiarvo", en: "average", sv: "snitt" },
  total_label:  { fi: "yhteensä", en: "total", sv: "totalt" },
  no_history:   { fi: "Ei vielä historiaa tällä jaksolla.", en: "No history for this period yet.", sv: "Ingen historik för denna period än." },
  mood_hist_t:  { fi: "Fiilishistoria", en: "Mood history", sv: "Känslohistorik" },

  /* ilmoitukset */
  notif_t:      { fi: "Ilmoitukset", en: "Notifications", sv: "Aviseringar" },
  notif_sub:    { fi: "Valitse mitä ilmoituksia Vire saa lähettää.", en: "Choose which notifications Vire may send.", sv: "Välj vilka aviseringar Vire får skicka." },
  notif_workout:{ fi: "Liikuntamuistutukset", en: "Workout reminders", sv: "Träningspåminnelser" },
  notif_workout_s: { fi: "Muistuta liikkumaan päivittäin", en: "Remind me to move daily", sv: "Påminn mig att röra på mig dagligen" },
  notif_meal:   { fi: "Ateriamuistutukset", en: "Meal reminders", sv: "Måltidspåminnelser" },
  notif_meal_s: { fi: "Muistuta kirjaamaan ateriat", en: "Remind me to log meals", sv: "Påminn mig att logga måltider" },
  notif_weekly: { fi: "Viikkokooste", en: "Weekly summary", sv: "Veckosammanfattning" },
  notif_weekly_s: { fi: "Yhteenveto sunnuntaisin", en: "Summary on Sundays", sv: "Sammanfattning på söndagar" },
  notif_mood:   { fi: "Fiiliskysely", en: "Mood check-in", sv: "Känslokoll" },
  notif_mood_s: { fi: "Kysy päivän fiilistä iltaisin", en: "Ask about your mood in the evening", sv: "Fråga om din känsla på kvällen" },

  /* asetukset */
  settings_t:   { fi: "Asetukset", en: "Settings", sv: "Inställningar" },
  appearance:   { fi: "Ulkoasu", en: "Appearance", sv: "Utseende" },
  dark_mode:    { fi: "Tumma tila", en: "Dark mode", sv: "Mörkt läge" },
  dark_mode_s:  { fi: "Vaihda sovellus tummaksi", en: "Switch the app to dark", sv: "Byt appen till mörkt" },
  hide_rings:   { fi: "Piilota tavoiterenkaat", en: "Hide goal rings", sv: "Dölj målringar" },
  hide_rings_s: { fi: "Piilota ympyräkuvaajat yleisnäkymästä", en: "Hide the ring charts from the overview", sv: "Dölj ringdiagrammen från översikten" },
  language:     { fi: "Kieli", en: "Language", sv: "Språk" },
  lang_fi:      { fi: "Suomi", en: "Finnish", sv: "Finska" },
  lang_en:      { fi: "Englanti", en: "English", sv: "Engelska" },
  lang_sv:      { fi: "Ruotsi", en: "Swedish", sv: "Svenska" },
  data_section: { fi: "Tiedot", en: "Data", sv: "Data" },
  cloud_section:{ fi: "Pilvisynkronointi", en: "Cloud sync", sv: "Molnsynk" },
  sync_url:     { fi: "Ohjelmien lähde-URL", en: "Programme source URL", sv: "Programkälla-URL" },
  sync_url_ph:  { fi: "https://… (julkaistu Google Sheet CSV)", en: "https://… (published Google Sheet CSV)", sv: "https://… (publicerat Google Sheet CSV)" },
  sync_note:    { fi: "Treeni- ja ravinto-ohjelmat haetaan tästä osoitteesta sovelluksen käynnistyessä. Käytä julkaistua Google Sheet -taulukkoa (CSV) tai repon CSV/JSON-tiedostoa.", en: "Training and nutrition programmes are fetched from this URL on startup. Use a published Google Sheet (CSV) or a CSV/JSON file in the repo.", sv: "Tränings- och näringsprogram hämtas från denna URL vid start. Använd ett publicerat Google Sheet (CSV) eller en CSV/JSON-fil i repot." },
  sync_now:     { fi: "Synkronoi nyt", en: "Sync now", sv: "Synka nu" },
  sync_ok:      { fi: "Synkronoitu", en: "Synced", sv: "Synkat" },
  sync_fail:    { fi: "Synkronointi epäonnistui — tarkista osoite", en: "Sync failed — check the URL", sv: "Synk misslyckades — kontrollera URL:en" },
  sync_none:    { fi: "Ei lähdettä asetettu", en: "No source set", sv: "Ingen källa angiven" },
  start_over:   { fi: "Aloita alusta", en: "Start over", sv: "Börja om" },
  start_over_s: { fi: "Nollaa profiili ja kaikki kirjaukset", en: "Reset profile and all entries", sv: "Nollställ profil och alla poster" },
  reset_btn:    { fi: "Nollaa", en: "Reset", sv: "Nollställ" },
  reset_confirm:{ fi: "Haluatko varmasti aloittaa alusta? Kaikki tietosi poistetaan tästä laitteesta — tätä ei voi perua.", en: "Are you sure you want to start over? All your data on this device will be deleted — this can't be undone.", sv: "Vill du verkligen börja om? All din data på denna enhet raderas — detta kan inte ångras." },
  reset_yes:    { fi: "Kyllä, nollaa kaikki", en: "Yes, reset everything", sv: "Ja, nollställ allt" },
};

function makeT(lang) {
  const L = (lang === "en" || lang === "sv") ? lang : "fi";
  return function t(key, vars) {
    const entry = STR[key];
    let s = entry ? (entry[L] || entry.fi) : key;
    if (vars) for (const k in vars) s = s.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
    return s;
  };
}

/* viikonpäivät + kuukaudet kielikohtaisesti */
const DOW_SHORT = {
  fi: ["Ma","Ti","Ke","To","Pe","La","Su"],
  en: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  sv: ["Mån","Tis","Ons","Tor","Fre","Lör","Sön"],
};
const DOW_LONG = {
  fi: ["sunnuntai","maanantai","tiistai","keskiviikko","torstai","perjantai","lauantai"],
  en: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  sv: ["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"],
};
const MONTHS = {
  fi: ["tammikuuta","helmikuuta","maaliskuuta","huhtikuuta","toukokuuta","kesäkuuta","heinäkuuta","elokuuta","syyskuuta","lokakuuta","marraskuuta","joulukuuta"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  sv: ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"],
};
const MONTHS_SHORT = {
  fi: ["tammi","helmi","maalis","huhti","touko","kesä","heinä","elo","syys","loka","marras","joulu"],
  en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  sv: ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"],
};

function longDateL(lang, d = new Date()) {
  const L = DOW_LONG[lang] ? lang : "fi";
  const dow = DOW_LONG[L][d.getDay()];
  const cap = dow.charAt(0).toUpperCase() + dow.slice(1);
  if (L === "en") return `${cap}, ${MONTHS[L][d.getMonth()]} ${d.getDate()}`;
  if (L === "sv") return `${cap} ${d.getDate()} ${MONTHS[L][d.getMonth()]}`;
  return `${cap} ${d.getDate()}. ${MONTHS[L][d.getMonth()]}`;
}
function localeFor(lang) { return lang === "en" ? "en-GB" : lang === "sv" ? "sv-SE" : "fi-FI"; }
function numFmt(lang, n) { return Number(n).toLocaleString(localeFor(lang)); }

Object.assign(window, { STR, makeT, DOW_SHORT, DOW_LONG, MONTHS, MONTHS_SHORT, longDateL, localeFor, numFmt });
