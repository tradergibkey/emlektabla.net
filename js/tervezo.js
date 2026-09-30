/* Online emléktábla tervező v2 — emlektabla.net */
(function () {
  "use strict";

  var state = {
    material: "granit",
    size: "30x20",
    customSize: "",
    orient: "fekvo",
    text: "Emlékül\nszeretteinknek",
    font: "klasszikus",
    customFont: "",
    bgColor: "fekete",
    textColor: "arany",
    motif: "nincs",
    motifColor: "arany"
  };

  /* ---- Color palette (text/motif = 16 colors; stone-bg = material-specific) ---- */
  var COLORS = [
    /* Univerzális (szöveg + díszítés + részben kőháttér) */
    {id:"fekete",    label:"Fekete",       hex:"#1B1922"},
    {id:"sotetszurke",label:"Sötétszürke", hex:"#4A4856"},
    {id:"szurke",    label:"Szürke",       hex:"#8A8898"},
    {id:"vilagosszurke",label:"Világosszürke",hex:"#C4C2CC"},
    {id:"feher",     label:"Fehér",        hex:"#F7F5FA"},
    {id:"krem",      label:"Krém",         hex:"#F5E6C8"},
    {id:"arany",     label:"Arany",        hex:"#C9962E"},
    {id:"sotetarany",label:"Sötét arany",  hex:"#8B6914"},
    {id:"bronz",     label:"Bronz",        hex:"#8C5E3C"},
    {id:"ezust",     label:"Ezüst",        hex:"#B9BCC8"},
    {id:"bordo",     label:"Bordó",        hex:"#6B1530"},
    {id:"voros",     label:"Vörös",        hex:"#8B2020"},
    {id:"sotetkek",  label:"Sötétkék",     hex:"#1B2A4A"},
    {id:"zold",      label:"Zöld",         hex:"#2A5A3A"},
    {id:"barna",     label:"Barna",        hex:"#5C3D2E"},
    {id:"terrakotta",label:"Terrakotta",   hex:"#C47244"},
    /* Gránit-specifikus árnyalatok (kereskedelmi kőnevek) */
    {id:"gr_szurke", label:"Padang szürke",     hex:"#B8B6B0"},
    {id:"gr_voros",  label:"Imperial vörös",    hex:"#7A3A34"},
    {id:"gr_kek",    label:"Blue Pearl kékes",  hex:"#3A4250"},
    {id:"gr_zold",   label:"Verde zöld",        hex:"#1F3B30"},
    /* Mészkő-specifikus árnyalatok */
    {id:"me_travertin",label:"Travertin",       hex:"#EDE6D6"},
    {id:"me_suttoi", label:"Süttői bézs",       hex:"#D9C3A0"},
    {id:"me_jura",   label:"Jura sárga",        hex:"#D8BE84"},
    {id:"me_szurke", label:"Jura szürke",       hex:"#A9A59B"}
  ];

  /* Melyik kőháttér-szín melyik anyagnál elérhető */
  var STONE_BG = {
    granit:  ["fekete","sotetszurke","gr_szurke","gr_voros","barna","gr_kek","gr_zold"],
    meszko:  ["krem","me_travertin","me_suttoi","me_jura","me_szurke"],
    marvany: []  /* márvány palettát elrejtjük */
  };

  function hexFor(id) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id === id) return COLORS[i].hex;
    return "#C9962E";
  }
  function labelFor(id) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id === id) return COLORS[i].label;
    return id;
  }

  var LABELS = {
    material: { granit: "Gránit", marvany: "Márvány", meszko: "Mészkő" },
    orient: { fekvo: "fekvő", allo: "álló" },
    font: { klasszikus: "Klasszikus (talpas)", modern: "Modern (talp nélküli)", vesett: "Vésett hatású" },
    motif: { nincs: "Nincs", keret: "Keret", kereszt: "Kereszt", olajag: "Olajág", csillag: "Csillag", koszoru: "Koszorú", galamb: "Galamb", konyv: "Nyitott könyv", cimer: "Címer-hely", napsugar: "Napsugár", kalasz: "Kalász" }
  };

  var MOTIF_SVG = {
    kereszt: '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M27 3 L37 3 Q33.6 11 34.4 19.4 Q44 19 55 15.5 L55 28.5 Q44 25 34.4 24.6 Q34 42 38.5 61 L25.5 61 Q30 42 29.6 24.6 Q20 25 9 28.5 L9 15.5 Q20 19 29.6 19.4 Q30.4 11 27 3Z"/></svg>',
    olajag: '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M10 57 C20 47 34 30 55 8" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><path d="M14.44 52.39 Q20.14 55.99 26.34 51.39 Q19.45 47.9 14.44 52.39Z M17.21 49.4 Q21.21 44.21 17.32 37.79 Q13.31 44.14 17.21 49.4Z M20.93 45.32 Q26.35 48.58 32.09 44.15 Q25.55 41 20.93 45.32Z M24.11 41.77 Q27.8 36.85 24.08 30.87 Q20.39 36.87 24.11 41.77Z M28.38 37 Q33.46 40.04 38.81 35.87 Q32.69 32.94 28.38 37Z M32.02 32.93 Q35.47 28.34 32 22.75 Q28.55 28.35 32.02 32.93Z M36.89 27.52 Q41.61 30.38 46.62 26.52 Q40.93 23.76 36.89 27.52Z M41.05 22.95 Q44.3 18.72 41.12 13.49 Q37.86 18.67 41.05 22.95Z M46.58 16.94 Q50.92 19.65 55.61 16.13 Q50.37 13.51 46.58 16.94Z M55 8 Q59.97 7.14 61.21 1.49 Q55.63 3 55 8Z"/><path d="M22.5 43.57 L26.25 47.59" stroke="currentColor" stroke-width="1.1" fill="none"/><ellipse cx="27.75" cy="49.2" rx="2.4" ry="3.2" transform="rotate(-43.09 27.75 49.2)"/><path d="M33.93 30.8 L29.53 27.5" stroke="currentColor" stroke-width="1.1" fill="none"/><ellipse cx="27.78" cy="26.17" rx="2.4" ry="3.2" transform="rotate(-233.02 27.78 26.17)"/></svg>',
    csillag: '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 33.5 L32 4.5 L38.94 23.95Z M32 33.5 L59.58 24.54 L43.22 37.15Z M32 33.5 L49.05 56.96 L32 45.3Z M32 33.5 L14.95 56.96 L20.78 37.15Z M32 33.5 L4.42 24.54 L25.06 23.95Z"/><path d="M32 33.5 L38.94 23.95 L59.58 24.54Z M32 33.5 L43.22 37.15 L49.05 56.96Z M32 33.5 L32 45.3 L14.95 56.96Z M32 33.5 L20.78 37.15 L4.42 24.54Z M32 33.5 L25.06 23.95 L32 4.5Z" opacity=".62"/></svg>',
    koszoru: '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M35.65 51.68 A21 21 0 0 0 42.5 12.81" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M28.35 51.68 A21 21 0 0 1 21.5 12.81" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M37.08 51.38 Q39.71 55.98 45.76 55.24 Q42.26 50.25 37.08 51.38Z M37.08 51.38 Q42.18 49.94 42.93 43.89 Q37.24 46.08 37.08 51.38Z M42.18 49.37 Q45.74 52.95 51.12 50.78 Q46.67 47.05 42.18 49.37Z M42.18 49.37 Q46.52 46.79 45.72 41.04 Q41.02 44.45 42.18 49.37Z M46.59 46.11 Q50.73 48.52 55.14 45.21 Q50.14 42.88 46.59 46.11Z M46.59 46.11 Q49.94 42.67 47.78 37.59 Q44.32 41.88 46.59 46.11Z M50 41.82 Q54.39 43.01 57.61 38.9 Q52.46 37.99 50 41.82Z M50 41.82 Q52.22 37.85 49.01 33.73 Q46.88 38.5 50 41.82Z M52.19 36.79 Q56.48 36.81 58.42 32.26 Q53.5 32.7 52.19 36.79Z M52.19 36.79 Q53.24 32.62 49.3 29.65 Q48.53 34.53 52.19 36.79Z M53 31.37 Q56.91 30.34 57.56 25.73 Q53.19 27.33 53 31.37Z M53 31.37 Q52.94 27.32 48.63 25.58 Q49.12 30.2 53 31.37Z M52.38 25.92 Q55.67 24.04 55.14 19.71 Q51.57 22.21 52.38 25.92Z M52.38 25.92 Q51.35 22.27 47.02 21.73 Q48.58 25.8 52.38 25.92Z M50.37 20.82 Q52.88 18.32 51.36 14.55 Q48.74 17.67 50.37 20.82Z M50.37 20.82 Q48.56 17.77 44.52 18.34 Q46.92 21.63 50.37 20.82Z M47.11 16.41 Q48.76 13.57 46.49 10.54 Q44.89 13.98 47.11 16.41Z M47.11 16.41 Q44.75 14.11 41.26 15.59 Q44.21 17.97 47.11 16.41Z M42.82 13 Q43.62 10.07 40.86 7.91 Q40.26 11.35 42.82 13Z M42.82 13 Q40.16 11.51 37.41 13.66 Q40.6 15.08 42.82 13Z M41.86 12.46 Q40.31 9.14 36.12 9.41 Q38.24 13.03 41.86 12.46Z M26.92 51.38 Q21.74 50.25 18.24 55.24 Q24.29 55.98 26.92 51.38Z M26.92 51.38 Q26.76 46.08 21.07 43.89 Q21.82 49.94 26.92 51.38Z M21.82 49.37 Q17.33 47.05 12.88 50.78 Q18.26 52.95 21.82 49.37Z M21.82 49.37 Q22.98 44.45 18.28 41.04 Q17.48 46.79 21.82 49.37Z M17.41 46.11 Q13.86 42.88 8.86 45.21 Q13.27 48.52 17.41 46.11Z M17.41 46.11 Q19.68 41.88 16.22 37.59 Q14.06 42.67 17.41 46.11Z M14 41.82 Q11.54 37.99 6.39 38.9 Q9.61 43.01 14 41.82Z M14 41.82 Q17.12 38.5 14.99 33.73 Q11.78 37.85 14 41.82Z M11.81 36.79 Q10.5 32.7 5.58 32.26 Q7.52 36.81 11.81 36.79Z M11.81 36.79 Q15.47 34.53 14.7 29.65 Q10.76 32.62 11.81 36.79Z M11 31.37 Q10.81 27.33 6.44 25.73 Q7.09 30.34 11 31.37Z M11 31.37 Q14.88 30.2 15.37 25.58 Q11.06 27.32 11 31.37Z M11.62 25.92 Q12.43 22.21 8.86 19.71 Q8.33 24.04 11.62 25.92Z M11.62 25.92 Q15.42 25.8 16.98 21.73 Q12.65 22.27 11.62 25.92Z M13.63 20.82 Q15.26 17.67 12.64 14.55 Q11.12 18.32 13.63 20.82Z M13.63 20.82 Q17.08 21.63 19.48 18.34 Q15.44 17.77 13.63 20.82Z M16.89 16.41 Q19.11 13.98 17.51 10.54 Q15.24 13.57 16.89 16.41Z M16.89 16.41 Q19.79 17.97 22.74 15.59 Q19.25 14.11 16.89 16.41Z M21.18 13 Q23.74 11.35 23.14 7.91 Q20.38 10.07 21.18 13Z M21.18 13 Q23.4 15.08 26.59 13.66 Q23.84 11.51 21.18 13Z M22.14 12.46 Q25.76 13.03 27.88 9.41 Q23.69 9.14 22.14 12.46Z"/><path d="M32 52 C27.5 47.5 21.5 48.5 22.5 53 C23.5 56.8 28.8 55.2 32 53 C35.2 55.2 40.5 56.8 41.5 53 C42.5 48.5 36.5 47.5 32 52Z"/><path d="M30.6 53.2 L26.8 61.5 L29.6 60.4 L31 63 L32.2 54Z M33.4 53.2 L37.2 61.5 L34.4 60.4 L33 63 L31.8 54Z"/><circle cx="32" cy="52.8" r="2.3"/></svg>',
    galamb: '<svg viewBox="0 0 64 64" fill="currentColor"><path fill-rule="evenodd" d="M45 37 C44 26 38 15 27 8 C22.5 5 17.5 3.8 12.5 4.2 Q14.5 7.6 18.6 9.4 Q13 9.2 10.2 11.4 Q13.5 14.2 19.6 15 Q13.4 15.6 9.4 18.2 Q13.6 21 20.2 21.2 Q14.6 22.6 11.4 25.4 Q16.4 27.6 22.6 27.6 Q18 29.2 15.4 32 Q20.6 33.6 27 33.4 L22 37.2 C18 39.5 14 41.5 10 42.2 Q5.4 39.2 1.6 38.8 Q3.2 41.4 4.8 44 Q2.4 45.4 0.8 47.8 Q4 48.4 7 48.6 Q5.4 51 4.6 53.4 Q9 51.6 13 49.4 C19 51 26 51.2 33 49.8 C41 48 48.5 44 53.5 39.6 C56.5 38.8 58.8 37.4 59.8 35.4 L63.2 34.4 L60.2 33 C59.6 30.4 57.4 28.6 54.6 28.6 C51.4 28.6 49 30.6 47.4 33.4 Z M56.4 31.3 a1.1 1.1 0 1 0 0.01 0 Z"/><path d="M61.5 35.2 C62 39 60.5 42.5 57.5 45" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><ellipse cx="62.2" cy="39.2" rx="1.9" ry="0.9" transform="rotate(70 62.2 39.2)"/><ellipse cx="58.3" cy="40.6" rx="1.9" ry="0.9" transform="rotate(-30 58.3 40.6)"/><ellipse cx="59.8" cy="44.6" rx="1.9" ry="0.9" transform="rotate(40 59.8 44.6)"/></svg>',
    konyv: '<svg viewBox="0 0 64 64" fill="currentColor"><path fill-rule="evenodd" d="M31 16 C24 11 14 10 5 12 L5 50 C14 48 24 49 31 54 Z M9 19 C15 18 21 18.6 26.5 21 L26.5 22.8 C21 20.6 15 20 9 20.8Z M9 25 C15 24 21 24.6 26.5 27 L26.5 28.8 C21 26.6 15 26 9 26.8Z M9 31 C15 30 21 30.6 26.5 33 L26.5 34.8 C21 32.6 15 32 9 32.8Z M9 37 C15 36 21 36.6 26.5 39 L26.5 40.8 C21 38.6 15 38 9 38.8Z"/><path fill-rule="evenodd" d="M33 16 C40 11 50 10 59 12 L59 50 C50 48 40 49 33 54 Z M55 19 C49 18 43 18.6 37.5 21 L37.5 22.8 C43 20.6 49 20 55 20.8Z M55 25 C49 24 43 24.6 37.5 27 L37.5 28.8 C43 26.6 49 26 55 26.8Z M55 31 C49 30 43 30.6 37.5 33 L37.5 34.8 C43 32.6 49 32 55 32.8Z M55 37 C49 36 43 36.6 37.5 39 L37.5 40.8 C43 38.6 49 38 55 38.8Z"/><path d="M2 15 L2 54 C13 52 24 53 32 58 C40 53 51 52 62 54 L62 15 L60 15 L60 52 C50 50.5 40 51.5 32 56 C24 51.5 14 50.5 4 52 L4 15Z"/></svg>',
    cimer: '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M17 15 L15 5 L22.5 10 L27 3 L32 9 L37 3 L41.5 10 L49 5 L47 15Z"/><circle cx="15" cy="4.2" r="1.6"/><circle cx="27" cy="2.4" r="1.6"/><circle cx="37" cy="2.4" r="1.6"/><circle cx="49" cy="4.2" r="1.6"/><circle cx="32" cy="7.6" r="1.6"/><path fill-rule="evenodd" d="M12 18 L52 18 L52 36 C52 48 43 56 32 61 C21 56 12 48 12 36Z M16 22 L48 22 L48 36 C48 45.5 41 52 32 56.4 C23 52 16 45.5 16 36Z"/><path d="M31 22 L33 22 L33 56 L31 55Z M16 34 L48 34 L48 36 L16 36Z" opacity=".45"/></svg>',
    napsugar: '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M46.45 30.84 L62 32 L46.45 33.16Z M46.21 34.87 L54.7 38.08 L45.74 36.62Z M45.1 38.22 L57.98 47 L43.94 40.23Z M42.88 41.59 L48.62 48.62 L41.59 42.88Z M40.23 43.94 L47 57.98 L38.22 45.1Z M36.62 45.74 L38.08 54.7 L34.87 46.21Z M33.16 46.45 L32 62 L30.84 46.45Z M29.13 46.21 L25.92 54.7 L27.38 45.74Z M25.78 45.1 L17 57.98 L23.77 43.94Z M22.41 42.88 L15.38 48.62 L21.12 41.59Z M20.06 40.23 L6.02 47 L18.9 38.22Z M18.26 36.62 L9.3 38.08 L17.79 34.87Z M17.55 33.16 L2 32 L17.55 30.84Z M17.79 29.13 L9.3 25.92 L18.26 27.38Z M18.9 25.78 L6.02 17 L20.06 23.77Z M21.12 22.41 L15.38 15.38 L22.41 21.12Z M23.77 20.06 L17 6.02 L25.78 18.9Z M27.38 18.26 L25.92 9.3 L29.13 17.79Z M30.84 17.55 L32 2 L33.16 17.55Z M34.87 17.79 L38.08 9.3 L36.62 18.26Z M38.22 18.9 L47 6.02 L40.23 20.06Z M41.59 21.12 L48.62 15.38 L42.88 22.41Z M43.94 23.77 L57.98 17 L45.1 25.78Z M45.74 27.38 L54.7 25.92 L46.21 29.13Z"/><circle cx="32" cy="32" r="11.5"/><circle cx="32" cy="32" r="13.3" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>',
    kalasz: '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M30 60 L33.74 42.39 M34 60 L30.26 42.39" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M34.83 24.44 L35.11 16.45 M40.05 25.55 L43.04 18.13 M35.86 20.29 L36.14 12.29 M40.8 21.34 L43.79 13.92 M36.89 16.13 L37.17 8.13 M41.55 17.12 L44.54 9.7 M40.31 11.48 L41.77 4.64 M23.95 25.55 L20.96 18.13 M29.17 24.44 L28.89 16.45 M23.2 21.34 L20.21 13.92 M28.14 20.29 L27.86 12.29 M22.45 17.12 L19.46 9.7 M27.11 16.13 L26.83 8.13 M23.69 11.48 L22.23 4.64" fill="none" stroke="currentColor" stroke-width=".8" stroke-linecap="round"/><path d="M33.33 44.35 Q35.29 40.44 31.75 36.92 Q29.94 41.57 33.33 44.35Z M33.33 44.35 Q37.55 43.19 37.79 38.2 Q33.12 39.97 33.33 44.35Z M34.28 39.85 Q36.16 36.12 32.78 32.76 Q31.05 37.2 34.28 39.85Z M34.28 39.85 Q38.31 38.74 38.54 33.98 Q34.09 35.68 34.28 39.85Z M35.24 35.35 Q37.02 31.8 33.8 28.6 Q32.16 32.83 35.24 35.35Z M35.24 35.35 Q39.07 34.3 39.3 29.77 Q35.05 31.38 35.24 35.35Z M36.2 30.85 Q37.89 27.48 34.83 24.44 Q33.28 28.46 36.2 30.85Z M36.2 30.85 Q39.84 29.85 40.05 25.55 Q36.02 27.08 36.2 30.85Z M37.15 26.35 Q38.76 23.16 35.86 20.29 Q34.39 24.09 37.15 26.35Z M37.15 26.35 Q40.6 25.41 40.8 21.34 Q36.99 22.78 37.15 26.35Z M38.11 21.85 Q39.62 18.84 36.89 16.13 Q35.5 19.72 38.11 21.85Z M38.11 21.85 Q41.36 20.96 41.55 17.12 Q37.95 18.48 38.11 21.85Z M38.86 18.33 Q41.86 15.75 40.31 11.48 Q37.16 14.75 38.86 18.33Z M30.67 44.35 Q30.88 39.97 26.21 38.2 Q26.45 43.19 30.67 44.35Z M30.67 44.35 Q34.06 41.57 32.25 36.92 Q28.71 40.44 30.67 44.35Z M29.72 39.85 Q29.91 35.68 25.46 33.98 Q25.69 38.74 29.72 39.85Z M29.72 39.85 Q32.95 37.2 31.22 32.76 Q27.84 36.12 29.72 39.85Z M28.76 35.35 Q28.95 31.38 24.7 29.77 Q24.93 34.3 28.76 35.35Z M28.76 35.35 Q31.84 32.83 30.2 28.6 Q26.98 31.8 28.76 35.35Z M27.8 30.85 Q27.98 27.08 23.95 25.55 Q24.16 29.85 27.8 30.85Z M27.8 30.85 Q30.72 28.46 29.17 24.44 Q26.11 27.48 27.8 30.85Z M26.85 26.35 Q27.01 22.78 23.2 21.34 Q23.4 25.41 26.85 26.35Z M26.85 26.35 Q29.61 24.09 28.14 20.29 Q25.24 23.16 26.85 26.35Z M25.89 21.85 Q26.05 18.48 22.45 17.12 Q22.64 20.96 25.89 21.85Z M25.89 21.85 Q28.5 19.72 27.11 16.13 Q24.38 18.84 25.89 21.85Z M25.14 18.33 Q26.84 14.75 23.69 11.48 Q22.14 15.75 25.14 18.33Z"/><path d="M27.5 49 Q32 47.5 36.5 49 L36.5 52.6 Q32 51 27.5 52.6Z"/><path d="M29 52 L26 58 L28.6 57.2 M35 52 L38 58 L35.4 57.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var plaque = document.getElementById("plaque");
  var plaqueText = document.getElementById("plaqueText");
  var plaqueMotif = document.getElementById("plaqueMotif");
  var plaqueFrame = document.getElementById("plaqueFrame");
  var stage = document.getElementById("stage");
  var stageSize = document.getElementById("stageSize");
  var btnQuote = document.getElementById("btnQuote");
  if (!plaque || !stage) return;

  /* ---------- render ---------- */
  function render() {
    /* material texture */
    plaque.className = "plaque stone-" + state.material
      + " orient-" + state.orient
      + " size-" + state.size.replace("x", "-");

    /* background color overlay */
    plaque.style.backgroundColor = hexFor(state.bgColor);

    /* text color */
    var tc = hexFor(state.textColor);
    plaqueText.style.cssText = "";
    plaqueText.style.color = tc;
    /* add metallic gradient for gold/silver */
    if (state.textColor === "arany" || state.textColor === "sotetarany") {
      plaqueText.style.background = "linear-gradient(160deg,#E8C165 10%,#B07E1F 45%,#F0D48A 70%,#A87718 100%)";
      plaqueText.style.webkitBackgroundClip = "text";
      plaqueText.style.backgroundClip = "text";
      plaqueText.style.color = "transparent";
      plaqueText.style.filter = "drop-shadow(0 1px 1px rgba(0,0,0,.45))";
    } else if (state.textColor === "ezust") {
      plaqueText.style.background = "linear-gradient(160deg,#E6E8F0 10%,#9FA3B2 45%,#F2F3F8 70%,#8E92A2 100%)";
      plaqueText.style.webkitBackgroundClip = "text";
      plaqueText.style.backgroundClip = "text";
      plaqueText.style.color = "transparent";
      plaqueText.style.filter = "drop-shadow(0 1px 1px rgba(0,0,0,.4))";
    } else if (state.textColor === "bronz") {
      plaqueText.style.background = "linear-gradient(160deg,#C49A6C 10%,#8C5E3C 45%,#D4AA78 70%,#7A4E2E 100%)";
      plaqueText.style.webkitBackgroundClip = "text";
      plaqueText.style.backgroundClip = "text";
      plaqueText.style.color = "transparent";
      plaqueText.style.filter = "drop-shadow(0 1px 1px rgba(0,0,0,.4))";
    } else {
      plaqueText.style.textShadow = "0 1px 1px rgba(0,0,0,.3)";
    }

    /* font family */
    if (state.font === "klasszikus") {
      plaqueText.style.fontFamily = 'Georgia, "Times New Roman", serif';
      plaqueText.style.letterSpacing = ".04em";
      plaqueText.style.textTransform = "none";
      plaqueText.style.fontSize = "";
    } else if (state.font === "modern") {
      plaqueText.style.fontFamily = "var(--font-head, 'Sora'), sans-serif";
      plaqueText.style.letterSpacing = ".02em";
      plaqueText.style.textTransform = "none";
      plaqueText.style.fontSize = "";
    } else {
      plaqueText.style.fontFamily = "'Space Mono', monospace";
      plaqueText.style.letterSpacing = ".14em";
      plaqueText.style.textTransform = "uppercase";
      plaqueText.style.fontSize = "clamp(.9rem,2.6vw,1.2rem)";
    }

    /* text content */
    var safe = state.text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");
    plaqueText.innerHTML = safe || "&nbsp;";

    /* motif color + visibility */
    var mc = hexFor(state.motifColor);
    plaqueFrame.style.borderColor = mc;
    plaqueMotif.style.color = mc;
    plaqueFrame.style.display = state.motif === "keret" ? "block" : "none";
    if (MOTIF_SVG[state.motif]) {
      plaqueMotif.innerHTML = MOTIF_SVG[state.motif];
      plaqueMotif.style.display = "block";
    } else {
      plaqueMotif.style.display = "none";
    }

    /* size label */
    var dims = state.size.split("x");
    var shown = state.orient === "allo" ? dims[1] + " × " + dims[0] : dims[0] + " × " + dims[1];
    var sizeText = state.customSize ? state.customSize + " (egyedi)" : shown + " cm · " + LABELS.orient[state.orient];
    if (stageSize) stageSize.textContent = sizeText;

    updateQuoteLink();
  
    /* Arany-figyelmeztetés láthatósága */
    var _goldNoticeEl = document.getElementById("goldNotice");
    if (_goldNoticeEl) {
      var _isGold =
        state.textColor === "arany" || state.textColor === "sotetarany" ||
        state.motifColor === "arany" || state.motifColor === "sotetarany";
      _goldNoticeEl.hidden = !_isGold;
    }

    /* Anyagfüggő háttérszín-paletta: gomb láthatóság + auto-váltás ha az aktuális szín nem érvényes */
    var _bgGrid = document.getElementById("ctrlBgColor");
    var _marvNote = document.getElementById("marvanyNote");
    var _isMarvany = state.material === "marvany";
    var _allowed = STONE_BG[state.material] || [];
    if (_bgGrid) {
      _bgGrid.style.display = _isMarvany ? "none" : "";
      var _btns = _bgGrid.querySelectorAll("[data-color]");
      for (var _i = 0; _i < _btns.length; _i++) {
        var _cid = _btns[_i].getAttribute("data-color");
        var _ok = _allowed.indexOf(_cid) !== -1;
        _btns[_i].style.display = _ok ? "" : "none";
        if (!_ok && _btns[_i].classList.contains("active")) {
          _btns[_i].classList.remove("active");
          _btns[_i].setAttribute("aria-pressed", "false");
        }
      }
      /* Ha a jelenlegi bgColor nem érvényes az új anyagnál -> első engedélyezett */
      if (!_isMarvany && _allowed.indexOf(state.bgColor) === -1 && _allowed.length) {
        state.bgColor = _allowed[0];
        plaque.style.backgroundColor = hexFor(state.bgColor);
        var _first = _bgGrid.querySelector('[data-color="' + state.bgColor + '"]');
        if (_first) {
          _first.classList.add("active");
          _first.setAttribute("aria-pressed", "true");
        }
      }
    }
    if (_marvNote) _marvNote.hidden = !_isMarvany;

    /* Díszítés esetén hely a feliratnak */
    plaque.classList.toggle("has-motif", state.motif !== "nincs" && state.motif !== "keret");
  }

  /* ---------- quote handoff ---------- */
  function summary() {
    var dims = state.size.split("x");
    var shown = state.orient === "allo" ? dims[1] + "×" + dims[0] : dims[0] + "×" + dims[1];
    var sizeStr = state.customSize ? state.customSize + " (egyedi méret)" : shown + " cm (" + LABELS.orient[state.orient] + ")";
    var fontStr = state.customFont
      ? LABELS.font[state.font] + " — ügyfél kérése: \"" + state.customFont + "\""
      : LABELS.font[state.font];
    return "Az online tervezőben összeállított tábla:\n" +
      "\u2022 Anyag: " + LABELS.material[state.material] + "\n" +
      "\u2022 Méret: " + sizeStr + "\n" +
      "\u2022 Betűtípus: " + fontStr + "\n" +
      "\u2022 Háttérszín: " + labelFor(state.bgColor) + "\n" +
      "\u2022 Betűszín: " + labelFor(state.textColor) + "\n" +
      "\u2022 Díszítés: " + LABELS.motif[state.motif] + "\n" +
      "\u2022 Díszítés színe: " + labelFor(state.motifColor) + "\n" +
      "\u2022 Felirat: \u201E" + state.text.replace(/\n/g, " / ") + "\u201D";
  }

  function updateQuoteLink() {
    if (btnQuote) btnQuote.href = "/?terv=" + encodeURIComponent(summary()) + "#kapcsolat";
  }

  /* ---------- controls ---------- */
  function bindGroup(id, attr, key) {
    var wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-" + attr + "]");
      if (!btn) return;
      wrap.querySelectorAll(".active").forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      state[key] = btn.getAttribute("data-" + attr);
      render();
    });
  }

  bindGroup("ctrlMaterial", "material", "material");
  bindGroup("ctrlSize", "size", "size");
  bindGroup("ctrlOrient", "orient", "orient");
  bindGroup("ctrlFont", "font", "font");
  bindGroup("ctrlBgColor", "color", "bgColor");
  bindGroup("ctrlTextColor", "color", "textColor");
  bindGroup("ctrlMotif", "motif", "motif");
  bindGroup("ctrlMotifColor", "color", "motifColor");

  /* text inputs */
  function bindInput(id, key) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", function () {
      state[key] = el.value;
      render();
    });
  }
  bindInput("ctrlText", "text");
  bindInput("ctrlCustomSize", "customSize");
  bindInput("ctrlCustomFont", "customFont");

  /* ---------- gentle 3D tilt ---------- */
  var MAX_TILT = 7;
  function applyTilt(x, y) {
    var r = stage.getBoundingClientRect();
    var px = (x - r.left) / r.width - 0.5;
    var py = (y - r.top) / r.height - 0.5;
    plaque.style.transform = "rotateX(" + (-py * MAX_TILT) + "deg) rotateY(" + (px * MAX_TILT) + "deg)";
  }
  function resetTilt() { plaque.style.transform = "rotateX(2deg) rotateY(-4deg)"; }
  stage.addEventListener("mousemove", function (e) { applyTilt(e.clientX, e.clientY); });
  stage.addEventListener("mouseleave", resetTilt);
  stage.addEventListener("touchmove", function (e) {
    if (e.touches.length === 1) applyTilt(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  stage.addEventListener("touchend", resetTilt);

  resetTilt();
  render();
})();
