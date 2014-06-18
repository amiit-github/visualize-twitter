;(function() {
 
  var MAX_COLS = url.tsq == 'tower' ? 7 : 5,
      FADE_DELAY = 5000,  

      FADE_DUR = 500,
      MIN_DELAY = 3000,
      WIPE_DELAY = Math.max(url.int('delay', MIN_DELAY), MIN_DELAY),
      TITLE_DELAY = 6000,
      SMALL_WINDOW = 500, // see _shared.scss, fallback for browsers without mq
      TITLE = 'Hot searches on Google right now.',
      wipers = [],
      termsByRegion,
      terms,
      termIndex = 0,
      now,
      lastUpdate,
      idleTimeout, 
      matrixInitialized = false,
      matrix,
      matrixSelect, 
      rows,
      cols,
      pipe,

      showTitle = (function() {

        if (url.tsq == 'tower') {
          
          return function(wiper) {
            return wiper.id == 6 && wiper.numLoops % 2 == 0;
          }

        } else if (url.tsq == 'marquee') {

          return function(wiper) {
            return wiper.id == 5 && wiper.numLoops % 3 == 0;
          }

        } else { 

          return function() {
            return false;
          }

        }

      })(),

      showLogo = (function() {

        if (url.tsq == 'today') {

          return function(wiper) {
            return wiper.numLoops % 2 == 1;
          }

        } else {

          return function() {
            return false;
          }

        }

      })(),

      tsqMarqueeWidths = [320, 520],
      tsqMarqueeLefts = [0, tsqMarqueeWidths[0]],

      tsqTowerHeights = [68, 90, 94, 110, 105, 100, 155],
      tsqTowerTops = (function() {

        var r = [], s = 0, l = tsqTowerHeights.length;
        for (var i = 0; i < l; i++) {
          
          r[i] = s;
          s += tsqTowerHeights[i];

        }

        return r;

      })();

  init();
  getTerms(function(t) {

    termsByRegion = t;

    if (!matrixInitialized) {
      matrixInitialized = true;
      initializeMatrix();
    }

  });

  function getTerms(callback) {

    if (url.terms) {
      callback({ 1: url.terms.split(/ ?, ?/) });
    } else { 
      /*$.getJSON(url.tsq ? '/api/tsqterms/' : '/api/terms/', callback);*/


      /* ---- added custom code --- */
      $.getJSON('/data.php', callback);
      /*var data = 
      {"42": ["Balotelli", "England Italien", "Pirlo", "Costa Rica", "Chile mot Australien", "England Mot Italien", "Dreamhack", "Anna Faith Carlson", "Colombia", "Mexiko Mot Kamerun", "V\u00e4tternrundan", "One Direction", "Van Persie", "Spanien Nederl\u00e4nderna Vm", "Vm Fotboll 2014", "Summerburst", "Kartellen", "Radiotj\u00e4nst", "Diego Costa", "Holland"], "43": ["Anglie \u2013 It\u00e1lie", "Uruguay \u2013 Kostarika", "Pra\u017esk\u00e1 muzejn\u00ed noc", "Mexiko \u2013 Kamerun", "Daniel Landa", "Votvirak", "Mistrovstv\u00ed Sv\u011bta Ve Fotbale 2014", "Braz\u00edlie \u2013 Chorvatsko", "Neymar", "\u010ct Sport", "Lucie", "Ji\u0159\u00ed Bruder", "GE Money Bank", "Jaroslav Ka\u0148kovsk\u00fd", "Rihanna", "Justin Timberlake", "iOS 8", "Mezin\u00e1rodn\u00ed den d\u011bt\u00ed", "zem\u011bt\u0159esen\u00ed", "Gambrinus liga"], "49": ["Pirlo", "Le Mans 2014", "Costa Rica", "LeMans 2014", "Titanic", "Lemans", "Lana Del Rey", "Diego Costa", "Vm 2014", "Northside", "Ronaldinho", "Vm Manager", "Jennifer Lopez", "Neymar", "Tv2 Play", "World Cup 2014", "Hulk", "Messi", "VM", "Ronaldo"], "52": ["C\u00f4te D Ivoire Vs Japan", "England vs Italy", "Uruguay Vs Costa Rica", "Colombia vs Greece", "Kefee", "Spain vs Netherlands", "Chile vs Australia", "What Is Settlement", "Fabregas", "Mexico vs Cameroon", "World Cup 2014", "World Cup fixtures", "Rik Mayall", "new Emir of Kano", "Dora Akunyili", "Nigeria vs USA", "Ado Bayero", "Nigeria vs Greece", "Maya Angelou", "Nigeria vs Scotland"], "24": ["Babalar G\u00fcn\u00fc", "Fildi\u015fi S. - Japonya", "Fatih Harbiye Son b\u00f6l\u00fcm izle", "\u015eili - Avustralya", "Uruguay - Kosta Rika", "Robben", "Kolombiya - Yunanistan", "Medcezir sezon finali", "Ehliyet s\u0131nav sorular\u0131", "Karag\u00fcl Sezon Finali", "I\u015f\u0131l Karpuzo\u011flu", "\u0130spanya Hollanda", "Meksika - Kamerun D\u00fcnya Kupas\u0131", "\u0130ngiltere \u0130talya", "TRT1 izle", "LYS", "\u015eeyda Co\u015fkun", "Canl\u0131 ma\u00e7 izle", "Kurtlar Vadisi Pusu Son B\u00f6l\u00fcm Full izle", "Karde\u015f Pay\u0131 15.B\u00f6l\u00fcm"], "25": ["Quotes About Father", "C\u00f4te D Ivoire Vs Japan", "World Cup 2014", "Father S Day 2014", "England vs Italy", "Happy Fathers Day", "Chile vs Australia", "Uruguay Vs Costa Rica", "Colombia vs Greece", "Happy Father S Day 2014", "Father S Day Message For Husband", "Fathers Day", "Spain vs Netherlands", "Happy Fathers Day", "Fathers Day Quotes", "Mexico vs Cameroon", "Enzo Pastor", "Sylvester Stallone", "Kawhi Leonard", "What Is Communication"], "26": ["Costa De Marfil Contra Jap\u00f3n", "Andrea Pirlo", "Sterling", "Tamara Falco", "Pedro Zerolo", "Balotelli", "Dauphine Libere", "Inglaterra Contra Italia", "Uruguay Contra Costa Rica", "Colombia Contra Grecia", "Casillas", "Resultados Mundial 2014", "El hombre de las sombras", "Moto GP", "Sergio Ramos", "partidos de hoy", "Ole", "Chile contra Australia", "Espa\u00f1a Holanda", "M\u00e9xico contra Camer\u00fan"], "27": ["Paletta", "Mondiali Italia", "Darmian", "Italia \u2013 Costa Rica", "Pirlo", "Sturridge", "Andrea Pirlo", "Mario Balotelli", "Manaus", "Rooney", "Verratti", "Parolo", "Prandelli", "Fanny Neguesha", "Parolo", "Prossima Partita Italia 2014", "Carrefour", "Mcdonald", "Francia \u2013 Honduras", "Gabriel Paletta"], "21": ["Inglaterra Contra Italia", "Dia Del Padre", "Balotelli", "Feliz Dia Papa", "Uruguay Vs Costa Rica", "Inglaterra vs Italia", "Colombia Vs. Grecia", "Partido En Vivo", "Costa De Marfil Vs. Jap\u00f3n", "Calendario Mundial 2014", "Inglaterra", "Feliz dia del padre", "Imagenes Del Dia Del Padre", "Frases Para El Dia Del Padre", "Juegos Del Mundial 2014", "marca", "Andrea Pirlo", "Wayne Rooney", "Argentina Vs. Bosnia", "Brasil Contra M\u00e9xico"], "48": ["\u039a\u03bf\u03c3\u03c4\u03b1 \u03a1\u03b9\u03ba\u03b1", "\u0393\u03b9\u03bf\u03c1\u03c4\u03b7 \u03a4\u03bf\u03c5 \u03a0\u03b1\u03c4\u03b5\u03c1\u03b1", "\u0391\u03b3\u03b3\u03bb\u03b9\u03b1 \u0399\u03c4\u03b1\u03bb\u03b9\u03b1", "\u0395\u03bb\u03bb\u03b1\u03b4\u03b1 \u039a\u03bf\u03bb\u03bf\u03bc\u03b2\u03b9\u03b1 \u039c\u03bf\u03c5\u03bd\u03c4\u03b9\u03b1\u03bb", "\u0391\u03ba\u03c4\u03b7 \u0395\u03bb\u03b5\u03c6\u03b1\u03bd\u03c4\u03bf\u03c3\u03c4\u03bf\u03c5", "\u039a\u03bf\u03bb\u03bf\u03bc\u03b2\u03af\u03b1 \u0395\u03bd\u03b1\u03bd\u03c4\u03af\u03bf\u03bd \u0395\u03bb\u03bb\u03ac\u03b4\u03b1", "\u039f\u03c5\u03c1\u03bf\u03c5\u03b3\u03bf\u03c5\u03ac\u03b7 \u0395\u03bd\u03b1\u03bd\u03c4\u03af\u03bf\u03bd \u039a\u03cc\u03c3\u03c4\u03b1 \u03a1\u03af\u03ba\u03b1", "\u0399\u03c3\u03c0\u03b1\u03bd\u03b9\u03b1 \u039f\u03bb\u03bb\u03b1\u03bd\u03b4\u03b9\u03b1", "\u03a0\u03b1\u03b3\u03ba\u03cc\u03c3\u03bc\u03b9\u03bf \u039a\u03cd\u03c0\u03b5\u03bb\u03bb\u03bf \u0395\u03bb\u03bb\u03ac\u03b4\u03b1", "\u0395\u03b8\u03bd\u03b9\u03ba\u03b7 \u0395\u03bb\u03bb\u03b1\u03b4\u03bf\u03c3", "\u03a0\u03b1\u03b3\u03ba\u03cc\u03c3\u03bc\u03b9\u03bf \u039a\u03cd\u03c0\u03b5\u03bb\u03bb\u03bf \u039a\u03bf\u03bb\u03bf\u03bc\u03b2\u03af\u03b1", "\u03a7\u03b9\u03bb\u03b7 \u0391\u03c5\u03c3\u03c4\u03c1\u03b1\u03bb\u03b9\u03b1", "\u039a\u03b1\u03c1\u03bd\u03b5\u03b6\u03b7\u03c3", "\u0399\u03c3\u03c0\u03b1\u03bd\u03af\u03b1 \u039f\u03bb\u03bb\u03b1\u03bd\u03b4\u03af\u03b1 \u03a0\u03b1\u03b3\u03ba\u03cc\u03c3\u03bc\u03b9\u03bf \u039a\u03cd\u03c0\u03b5\u03bb\u03bb\u03bf", "\u0386\u03c1\u03b7\u03c2 \u03a3\u03c4\u03b1\u03b8\u03ac\u03ba\u03b7\u03c2", "\u03a0\u03b1\u03b3\u03ba\u03cc\u03c3\u03bc\u03b9\u03bf \u039a\u03cd\u03c0\u03b5\u03bb\u03bb\u03bf \u0392\u03c1\u03b1\u03b6\u03b9\u03bb\u03af\u03b1", "FIFA", "Nerit", "Mundial 2014", "Mundial"], "23": ["\ucf54\ud2b8\ub514\ubd80\uc544\ub974 vs \uc77c\ubcf8", "\ub85c\ub610602", "\uc789\uae00\ub79c\ub4dc VS \uc774\ud0c8\ub9ac\uc544", "\uc2a4\ud398\uc778 vs \ub124\ub35c\ub780\ub4dc", "\uc6d4\ub4dc\ucef5", "\uc6d4\ub4dc\ucef5\uc77c\uc815", "\uc778\uac04\uc911\ub3c5", "\ub958\ud604\uc9c4", "\ube0c\ub77c\uc9c8 vs \ud06c\ub85c\uc544\ud2f0\uc544", "\ubb38\ucc3d\uadf9", "\uc774\ud0dc\uc784", "\uc2e0\uc18c\uc728", "\ubb38\ucc3d\uadf9", "\ud589\uc624\ubc84", "\ub958\ud604\uacbd", "\ub85c\ub610601", "\ub958\ud604\uc9c4", "\uc804\ud6a8\uc131", "\ud604\uc544", "\uc9c0\ubc29 \uc120\uac70 \uac1c\ud45c \uacb0\uacfc"], "46": ["Angleterre Italie", "C\u00f4te D Ivoire \u2013 Japon", "Wayne Rooney", "Pirlo", "Andrea Pirlo", "Benjamin Winter", "Suisse \u2013 \u00c9quateur", "Frankreich gegen Honduras", "Sterling", "Joel Campbell", "Argovia Fest", "Uruguay gegen Costa Rica", "England gegen Italien", "Elfenbeink\u00fcste gegen Japan", "Kolumbien gegen Griechenland", "Chili Australie", "Schweiz Gegen Ecuador", "Tour de Suisse", "Buffon", "Le Mans 2014"], "47": ["Costa do Marfim vs Jap\u00e3o", "In\u00e9s Sainz", "Uruguai Vs Costa Rica", "Col\u00f4mbia vs Gr\u00e9cia", "Casillas", "Espanha Holanda 2014", "Espanha Vs Holanda Copa Do Mundo", "Inglaterra Vs It\u00e1lia", "M\u00e9xico Vs Camar\u00f5es", "rtp", "as", "Diego Costa", "The Libertines", "Abertura Da Copa 2014", "Campeonato Do Mundo 2014", "Neymar", "Brasil Croacia", "Mundial", "Claudia Leitte", "Andressa Urach"], "44": ["Andrea Pirlo", "Schweiz gegen Ecuador", "Frankreich gegen Honduras", "Manaus", "Buffon", "MotoGP", "Uruguay gegen Costa Rica", "England gegen Italien", "Kolumbien gegen Griechenland", "Le Mans 2014", "Elfenbeink\u00fcste gegen Japan", "Iker Casillas", "Regenbogenparade Wien 2014", "Benjamin Winter", "Regenbogenparade", "Chile Australien", "Grazathlon", "Diego Forlan", "Xabi Alonso", "Sergio Ramos"], "45": ["Elef\u00e1ntcsontpart -- Jap\u00e1n", "Franciaorsz\u00e1g -- Honduras", "Sv\u00e1jc -- Ecuador", "Uruguay -- Costa Rica", "Anglia -- Olaszorsz\u00e1g", "Chile -- Ausztr\u00e1lia", "Kolumbia -- G\u00f6r\u00f6gorsz\u00e1g", "Robben", "van Persie", "Spanyolorsz\u00e1g -- Hollandia Vil\u00e1gbajnoks\u00e1g", "Grosics Gyula", "Mexik\u00f3 -- Kamerun", "P\u00e9ntek 13", "Brazil Horv\u00e1t", "Vil\u00e1gbajnoks\u00e1g 2014", "Foci Vb 2014", "Braz\u00edlia -- Horv\u00e1torsz\u00e1g", "Braz\u00edlia Horv\u00e1torsz\u00e1g", "vil\u00e1gbajnoks\u00e1g", "Foci Vb"], "28": ["Th\u1ee5y S\u0129 \u0110\u1ea5u V\u1edbi Ecuador", "Anh Italia", "Argentina \u0110\u1ea5u V\u1edbi Bosnia V\u00e0 Herzegovina", "Ph\u00e1p \u0110\u1ea5u V\u1edbi Honduras", "\u0110\u1ee9c \u0110\u1ea5u V\u1edbi B\u1ed3 \u0110\u00e0o Nha", "Chung Ket Guong Mat Than Quen 2014", "Uruguay vs Costa Rica", "Colombia \u0110\u1ea5u V\u1edbi Hy L\u1ea1p", "\u0111i\u1ec3m thi t\u1ed1t nghi\u1ec7p THPT n\u0103m 2014", "B\u1edd Bi\u1ec3n Ng\u00e0 \u0110\u1ea5u V\u1edbi Nh\u1eadt B\u1ea3n", "Chile \u0110\u1ea5u V\u1edbi \u00dac", "Anh \u0110\u1ea5u V\u1edbi \u00dd", "Ng\u00e0y C\u1ee7a Cha", "Ca Do Bong Da", "Ket Qua World Cup", "T\u00e2y Ban Nha \u0110\u1ea5u V\u1edbi H\u00e0 Lan", "Ket Qua Bong Da World Cup 2014", "Xem Bong Da Truc Tuyen", "Le Khai Mac World Cup 2014", "\u0111i\u1ec3m thi t\u1ed1t nghi\u1ec7p 2014"], "29": ["\u0625\u0646\u062c\u0644\u062a\u0631\u0627 \u0636\u062f \u0625\u064a\u0637\u0627\u0644\u064a\u0627", "\u0645\u0628\u0627\u0631\u0627\u0629 \u0627\u0646\u062c\u0644\u062a\u0631\u0627 \u0648\u0627\u064a\u0637\u0627\u0644\u064a\u0627", "\u0633\u0627\u062d\u0644 \u0627\u0644\u0639\u0627\u062c \u0636\u062f \u0627\u0644\u064a\u0627\u0628\u0627\u0646", "\u0627\u0647\u062f\u0627\u0641 \u0647\u0648\u0644\u0646\u062f\u0627 \u0648\u0627\u0633\u0628\u0627\u0646\u064a\u0627", "\u0627\u0647\u062f\u0627\u0641 \u0627\u0633\u0628\u0627\u0646\u064a\u0627 \u0648\u0647\u0648\u0644\u0646\u062f\u0627", "\u0627\u0647\u062f\u0627\u0641 \u0647\u0648\u0644\u0646\u062f\u0627 \u0648\u0627\u0633\u0628\u0627\u0646\u064a\u0627", "\u0627\u0633\u0628\u0627\u0646\u064a\u0627 \u0648\u0647\u0648\u0644\u0646\u062f\u0627", "\u0627\u0645\u062a\u062d\u0627\u0646 \u0627\u0644\u0641\u064a\u0632\u064a\u0627\u0621 \u0644\u0644\u062b\u0627\u0646\u0648\u064a\u0629 \u0627\u0644\u0639\u0627\u0645\u0629 2014", "\u062a\u0634\u064a\u0644\u064a \u0636\u062f \u0623\u0633\u062a\u0631\u0627\u0644\u064a\u0627", "\u0627\u0647\u062f\u0627\u0641 \u0643\u0627\u0633 \u0627\u0644\u0639\u0627\u0644\u0645 2014", "\u0643\u0648\u0644\u0648\u0645\u0628\u064a\u0627 \u0636\u062f \u0627\u0644\u064a\u0648\u0646\u0627\u0646", "\u0627\u062c\u0627\u0628\u0629 \u0627\u0645\u062a\u062d\u0627\u0646 \u0627\u0644\u0641\u064a\u0632\u064a\u0627\u0621 2014", "uruguay vs costa rica", "\u062a\u0631\u062f\u062f \u0642\u0646\u0627\u0629 Bein Sport", "\u0627\u0647\u062f\u0627\u0641 \u0643\u0627\u0633 \u0627\u0644\u0639\u0627\u0644\u0645 2014", "\u0627\u0644\u0645\u0643\u0633\u064a\u0643 \u0636\u062f \u0627\u0644\u0643\u0627\u0645\u064a\u0631\u0648\u0646 \u0643\u0627\u0633 \u0627\u0644\u0639\u0627\u0644\u0645", "\u0627\u0647\u062f\u0627\u0641 \u0627\u0644\u0628\u0631\u0627\u0632\u064a\u0644 \u0648\u0643\u0631\u0648\u0627\u062a\u064a\u0627", "\u0627\u0644\u0642\u0646\u0648\u0627\u062a \u0627\u0644\u0645\u0641\u062a\u0648\u062d\u0629 \u0627\u0644\u0646\u0627\u0642\u0644\u0629 \u0644\u0643\u0627\u0633 \u0627\u0644\u0639\u0627\u0644\u0645 2014", "\u0628\u064a\u0646 \u0633\u0628\u0648\u0631\u062a", "\u0645\u0628\u0627\u0631\u0627\u0629 \u0627\u0641\u062a\u062a\u0627\u062d \u0643\u0627\u0633 \u0627\u0644\u0639\u0627\u0644\u0645 2014"], "40": ["Father S Day 2014", "C\u00f4te D Ivoire Vs Japan", "Fathersday", "Happy Fathers Day", "England vs Italy", "Uruguay vs Costa Rica", "Chile vs Australia", "Fathers Day Quotes", "Colombia vs Greece", "Spain vs Netherlands", "Mexico vs Cameroon", "SuperSport", "Friday the 13th", "Kefee", "World Cup 2014", "Jennifer Lopez", "Eskom", "World Cup 2014 Fixtures", "Cesc Fabregas", "World Cup 2014 Schedule"], "41": ["C\u00f4te D Ivoire \u2013 Japon", "Engeland versus Itali\u00eb", "Resultat Coupe Du Monde 2014", "Pirlo", "Angleterre Italie", "Uruguay Costa Rica", "Colombie \u2013 Gr\u00e8ce", "24H du Mans", "Espagne Pays-bas", "Wk 2014", "Chili Australie", "Sporza", "Mexique Cameroun", "Robben", "Spanje Versus Nederland", "Fifa Wereldkampioenschap Voetbal", "Diego Costa", "Jessica Rabbit", "Marcelo", "Ronaldo"], "1": ["Spurs", "Casey Kasem", "France vs Honduras", "Fathers Day", "Martin Kaymer", "Father's Day", "Gregg Popovich", "Lady Stoneheart", "Messi", "England vs Italy", "Happy Fathers Day", "Switzerland vs Ecuador", "Fathers Day Quotes", "Martin Kaymer", "Flag Day", "Jason Momoa", "LA Kings", "Ivory Coast", "Uruguay vs Costa Rica", "Friday the 13th"], "3": ["Michael Schumacher", "Live Score", "Argentina Vs Bosnia And Herzegovina", "Kick", "France vs Honduras", "Father's Day 2014", "cricket", "Switzerland vs Ecuador", "C\u00f4te D'ivoire Vs Japan", "Germany vs Portugal", "Happy Father Day", "Bhutan", "Fathers Day", "Uruguay vs Costa Rica", "Fathers Day Quotes", "England vs Italy", "Ness Wadia", "Chile vs Australia", "Colombia vs Greece", "Maksim Chmerkovskiy"], "5": ["Kawhi Leonard", "Michael Schumacher", "Casey Kasem", "Vermaelen", "Iran vs Nigeria", "England vs Italy", "Argentina Vs Bosnia And Herzegovina", "Switzerland vs Ecuador", "France vs Honduras", "Germany vs Portugal", "Fathers Day", "Van Persie", "England vs Italy", "C\u00f4te D'ivoire Vs Japan", "Father Day 2014", "Uruguay vs Costa Rica", "Colombia vs Greece", "Argentina Vs Bosnia And Herzegovina", "Father's Day 2014", "the hole"], "4": ["\u6b66\u7530\u68a8\u5948", "\u30e8\u30c3\u30af\u30e2\u30c3\u30af", "\u30a2\u30eb\u30bc\u30f3\u30c1\u30f3", "\u5712\u5b50\u6e29", "\u98ef\u8c4a\u307e\u308a\u3048", "\u30ef\u30fc\u30eb\u30c9\u30ab\u30c3\u30d7", "\u30b5\u30c3\u30ab\u30fc", "\u30b3\u30fc\u30c8\u30b8\u30dc\u30ef\u30fc\u30eb", "\u30c9\u30ed\u30b0\u30d0", "\u30b5\u30c3\u30ab\u30fc\u65e5\u672c\u4ee3\u8868", "\u5730\u9707", "\u672c\u7530\u572d\u4f51", "\u30a4\u30f3\u30b0\u30e9\u30f3\u30c9", "\u30b3\u30b9\u30bf\u30ea\u30ab", "\u30b5\u30c3\u30ab\u30fc \u30ef\u30fc\u30eb\u30c9\u30ab\u30c3\u30d7", "\u65e5\u672c", "\u30b3\u30ed\u30f3\u30d3\u30a2", "\u30e4\u30e4\u30c8\u30a5\u30fc\u30ec", "\u3067\u3093\u3071\u7d44", "\u30d0\u30ed\u30c6\u30c3\u30ea"], "6": ["\u05d4\u05d5\u05e0\u05d3\u05d5\u05e8\u05e1", "\u05d0\u05e8\u05d2\u05e0\u05d8\u05d9\u05e0\u05d4", "Argentina Vs Bosnia And Herzegovina", "\u05d7\u05d3\u05e9\u05d5\u05ea", "\u05e7\u05d5\u05e1\u05d8\u05d4 \u05e8\u05d9\u05e7\u05d4", "\u05e2\u05e8\u05d5\u05e5 7", "\u05ea\u05d4\u05d9\u05dc\u05d9\u05dd", "Honduras", "England vs Italy", "\u05d7\u05d3\u05e9\u05d5\u05ea 2", "\u05d0\u05e0\u05d2\u05dc\u05d9\u05d4 \u05de\u05d5\u05dc \u05d0\u05d9\u05d8\u05dc\u05d9\u05d4", "\u05d5\u05d5\u05d0\u05dc\u05d4 \u05d7\u05d3\u05e9\u05d5\u05ea", "\u05d4\u05d5\u05dc\u05e0\u05d3", "Costa Rica", "\u05d0\u05d5\u05e8\u05d5\u05d2\u05d5\u05d5\u05d0\u05d9 \u05de\u05d5\u05dc \u05e7\u05d5\u05e1\u05d8\u05d4 \u05e8\u05d9\u05e7\u05d4", "\u05e1\u05e4\u05e8\u05d3 \u05d4\u05d5\u05dc\u05e0\u05d3", "\u05e2\u05e8\u05d5\u05e5 7", "\u05d2\u05d5\u05e9 \u05e2\u05e6\u05d9\u05d5\u05df", "\u05d1\u05e8\u05d6\u05d9\u05dc \u05e7\u05e8\u05d5\u05d0\u05d8\u05d9\u05d4", "\u05e1\u05e4\u05e8\u05d3 \u05de\u05d5\u05dc \u05d4\u05d5\u05dc\u05e0\u05d3"], "9": ["Michael Schumacher", "Isis", "Begovic", "Michelle Keegan", "Thomas Vermaelen", "England", "Honduras", "Ivory Coast", "Switzerland vs Ecuador", "Gary Lewin", "Fathers Day", "Casey Kasem", "Bbc Live", "Phil Neville", "Germany vs Portugal", "Ryan Gosling", "RIO FERDINAND", "MotoGP", "Magna Carta", "2018 World Cup"], "8": ["NBA", "Michael Schumacher", "ISIS", "Casey Kasem", "Germany vs Portugal", "ATO", "Majak Daw", "Kendall Jenner", "Gmail account", "Game Of Thrones Season 5", "Argentina Vs Bosnia And Herzegovina", "Fathers Day", "Father's Day 2014", "Switzerland vs Ecuador", "Le Mans", "France vs Honduras", "Us Open Golf 2014", "The Rock", "Masterchef", "Bbc News"], "51": ["Pirlo", "John Mayer", "Costa Rica", "Nordsj\u00f8rittet", "Nordsj\u00f8rittet 2014", "Spania Nederland Vm", "Vm Fotball", "F\u00e6rderseilasen", "Lana Del Rey", "Marcelo", "fotball-VM 2014", "Vm 2014", "Fotball Vm", "Neymar", "Vm Fotball 2014", "Brasil", "Dealextreme", "Rik Mayall", "Stefan Strandberg", "E3"], "39": ["England vs Italy", "Fran\u021ba Vs. Honduras", "Uruguay Vs. Costa Rica", "Chile vs. Australia", "Van Persie", "Mexic Vs. Camerun", "Cm 2014", "Claudia Leitte", "World Cup 2014", "Jennifer Lopez", "Google Space", "Rafael Nadal", "Selena", "Nigeria", "Simona Halep", "Eurosport Live", "Roland Garros Live", "Formula 1", "Enrique Iglesias", "Roland Garros"], "38": ["Inglaterra vs Italia", "Uruguay Vs Costa Rica", "Costa De Marfil Vs. Jap\u00f3n", "Colombia Vs. Grecia", "Diario Marca", "Chile vs Australia", "M\u00e9xico vs Camer\u00fan", "Espa\u00f1a Vs. Holanda", "Espa\u00f1a contra Pa\u00edses Bajos en Copa Mundial", "Espa\u00f1a Contra Pa\u00edses Bajos", "marca", "Mourinho", "Jean Beausejour", "Cristiano Ronaldo", "Copa del Mundo 2014", "Brasil contra Croacia", "FIFA", "Mundial Brasil 2014", "Canal 13", "Claudia Leitte"], "10": ["Nba", "\u8881\u5f4c\u660e", "\u5fb7\u570b \u5c0d \u8461\u8404\u7259", "\u5384\u74dc\u591a\u723e", "\u963f\u6839\u5ef7 \u5c0d \u6ce2\u58eb\u5c3c\u4e9e\u8207\u8d6b\u585e\u54e5\u7dad\u7d0d", "\u745e\u58eb \u5c0d \u5384\u74dc\u591a", "\u6cd5\u570b \u5c0d \u5b8f\u90fd\u62c9\u65af", "\u79d1\u7279\u8fea\u74e6", "\u82f1\u683c\u862d", "\u6d3e\u8def", "\u54e5\u502b\u6bd4\u4e9e", "\u5929\u6587\u53f0", "\u54e5\u502b\u6bd4\u4e9e \u5c0d \u5e0c\u81d8", "\u7236\u89aa\u7bc0", "\u8c61\u7259\u6d77\u5cb8 \u5c0d \u65e5\u672c", "\u82f1\u683c\u862d \u5c0d \u7fa9\u5927\u5229", "\u70cf\u62c9\u572d \u5c0d \u54e5\u65af\u5927\u9ece\u52a0", "\u5361\u65af\u62ff\u65af", "\u65b0\u754c\u6771\u5317\u767c\u5c55\u8a08\u5283", "\u6771\u5317\u767c\u5c55"], "13": ["Tim Duncan", "France vs Honduras", "Casey Kasem", "Us Open Golf 2014", "Switzerland Vs Ecuador", "MMVA 2014", "Kendall Jenner", "Bc Teachers Strike", "MMVA", "Messi", "NHL", "Ivory Coast", "Uruguay vs Costa Rica", "Colombia vs Greece", "Happy Fathers Day", "Fathers Day Quotes", "England vs Italy", "LA Kings", "Van Persie", "NBA"], "12": ["\u5fb7\u570b \u5c0d \u8461\u8404\u7259", "\u99ac\u523a", "\u963f\u6839\u5ef7 \u5c0d \u6ce2\u58eb\u5c3c\u4e9e\u8207\u8d6b\u585e\u54e5\u7dad\u7d0d", "\u8c61\u7259\u6d77\u5cb8 \u5c0d \u65e5\u672c", "\u5f35\u8499\u6670", "\u6cd5\u570b \u5c0d \u5b8f\u90fd\u62c9\u65af", "\u4e16\u754c\u76c3\u8db3\u7403\u8cfd \u5384\u74dc\u591a", "\u5b89\u4ee5\u8ed2", "\u54e5\u502b\u6bd4\u4e9e \u5c0d \u5e0c\u81d8", "\u82f1\u683c\u862d \u5c0d \u7fa9\u5927\u5229", "\u745e\u58eb \u5c0d \u5384\u74dc\u591a", "\u70cf\u62c9\u572d \u5c0d \u54e5\u65af\u5927\u9ece\u52a0", "\u8c61\u7259\u6d77\u5cb8 \u5c0d \u65e5\u672c", "\u963f\u6839\u5ef7 \u5c0d \u6ce2\u58eb\u5c3c\u4e9e\u8207\u8d6b\u585e\u54e5\u7dad\u7d0d", "\u6797\u767e\u8ca8", "\u8377\u862d", "\u590f\u4e8e\u55ac", "\u58a8\u897f\u54e5 \u5c0d \u5580\u9ea5\u9686", "Nba", "\u897f\u73ed\u7259 \u5c0d \u8377\u862d"], "15": ["Martin Kaymer", "Public Viewing", "Iran Gegen Nigeria", "Honduras", "Michael Schumacher", "ARD", "Deutschland Portugal", "Wm Ergebnisse 2014", "Pirlo", "ZDF Live Stream", "ZDF Livestream", "Wm Deutschland", "D\u00fcsseldorf", "Ribery", "Schweinsteiger", "England gegen Italien", "Costa Rica", "Benjamin Winter", "Ecuador", "Argentinien"], "14": ["\u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0415\u0413\u042d", "\u0414\u0435\u043d\u044c \u043c\u0435\u0434\u0438\u043a\u0430", "\u0410\u0440\u0433\u0435\u043d\u0442\u0438\u043d\u0430 \u2013 \u0411\u043e\u0441\u043d\u0438\u044f \u0418 \u0413\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430", "\u0424\u0440\u0430\u043d\u0446\u0438\u044f \u2013 \u0413\u043e\u043d\u0434\u0443\u0440\u0430\u0441", "\u041a\u043e\u0442-\u0434'\u0438\u0432\u0443\u0430\u0440 \u2013 \u042f\u043f\u043e\u043d\u0438\u044f", "\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f \u2013 \u042d\u043a\u0432\u0430\u0434\u043e\u0440", "\u0414\u0435\u043d\u044c \u043e\u0442\u0446\u0430", "\u0418\u0441\u043f\u0430\u043d\u0438\u044f \u2013 \u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u041c\u0438\u0440\u0430 \u041f\u043e \u0424\u0443\u0442\u0431\u043e\u043b\u0443", "\u0410\u043d\u0433\u043b\u0438\u044f \u2013 \u0418\u0442\u0430\u043b\u0438\u044f", "\u0423\u0440\u0443\u0433\u0432\u0430\u0439 \u2013 \u041a\u043e\u0441\u0442\u0430-\u0440\u0438\u043a\u0430", "\u041a\u043e\u043b\u0443\u043c\u0431\u0438\u044f \u2013 \u0413\u0440\u0435\u0446\u0438\u044f", "\u0427\u0438\u043b\u0438 \u2013 \u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f", "\u0414\u0435\u043d\u044c \u043c\u0435\u0434\u0438\u043a\u0430", "\u0415\u0413\u042d", "\u0414\u0435\u043d\u044c \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u043e\u0433\u043e \u0440\u0430\u0431\u043e\u0442\u043d\u0438\u043a\u0430", "\u0428\u0443\u043c\u0430\u0445\u0435\u0440", "\u0444\u0443\u0442\u0431\u043e\u043b", "\u0447\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442", "\u0420\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u041c\u0438\u0440\u0430 \u041f\u043e \u0424\u0443\u0442\u0431\u043e\u043b\u0443", "\u0414\u0436\u0435\u043d\u043d\u0438\u0444\u0435\u0440 \u041b\u043e\u043f\u0435\u0441"], "17": ["Schumacher", "Messi", "Wk 2014", "Honduras", "Vaderdag", "Engeland Italie", "Ecuador", "Pirlo", "ISIS", "Italie Engeland", "Kris en Lisanne", "Van Persie", "Costa Rica", "Uitslagen WK", "Chili Australie", "Sam Kelly", "Uitslagen Wk 2014", "Le Mans", "Spaanse kranten", "VI Oranje"], "19": ["Swiss vs Ekuador", "Prediksi Argentina vs Bosnia", "Jerman vs Portugal", "Prediksi Prancis vs Honduras", "Italy Vs England", "Debat Capres", "Kolombia vs Yunani", "Inggris vs Italia", "Meksiko Vs Kamerun Piala Dunia", "Uruguay vs Kosta Rika", "Prediksi Pantai Gading vs Jepang", "Obor Rakyat", "Jadwal Piala Dunia 2014 Brasil", "Belanda Spanyol", "Spanyol vs Belanda", "Prediksi Spanyol vs Belanda", "Hasil Pertandingan Piala Dunia", "Chile vs Australia", "Hasil UN SMP 2014", "Prediksi Skor Spanyol Vs Belanda"], "18": ["Fran\u00e7a vs Honduras", "Resultado Dos Jogos Da Copa", "Mexico", "Chile x Austr\u00e1lia", "M\u00e9xico x Camar\u00f5es", "Tabela Da Copa 2014", "Jogos Da Copa 2014", "Inglaterra Vs It\u00e1lia", "Uruguai Vs Costa Rica", "Costa do Marfim vs Jap\u00e3o", "Col\u00f4mbia vs Gr\u00e9cia", "Santo Antonio", "Copa Do Mundo Espanha", "Jogos Copa", "jogos da Copa", "Xabi Alonso", "Bruna Marquezine", "Sexta Feira 13", "Diego Costa", "Copa Do Mundo M\u00e9xico"], "31": ["Wybrze\u017ce Ko\u015bci S\u0142oniowej \u2013 Japonia", "Manaus", "Sowa i Przyjaciele", "Agnieszka Szczurek", "Szwajcaria \u2013 Ekwador", "Francja \u2013 Honduras", "Pirlo", "W\u0142ochy Anglia", "Anglia W\u0142ochy 2014", "Junior Diaz", "Bart\u0142omiej Sienkiewicz", "Kostaryka", "Anglia \u2013 W\u0142ochy", "Chile \u2013 Australia", "Kolumbia \u2013 Grecja", "Wprost", "Mecz Hiszpania Holandia", "Robin van Persie", "Robben", "Joel Campbell"], "30": ["Uruguay Vs Costa Rica", "Inglaterra Contra Italia", "Costa De Marfil Vs. Jap\u00f3n", "Colombia Vs. Grecia", "Dia Del Padre", "Resultados Del Mundial 2014", "Frases Para El Dia Del Padre", "Iker Casillas", "Andrea Pirlo", "Luis Ventura", "Colombia", "Chile vs Australia", "Espa\u00f1a Vs. Holanda", "M\u00e9xico vs Camer\u00fan", "Espa\u00f1a contra Pa\u00edses Bajos en Copa Mundial", "Ver Mundial Online", "Futbol En Vivo", "Espa\u00f1a contra Pa\u00edses Bajos", "Presentacion Del Mundial Brasil 2014", "Vicky Xipolitaki"], "37": ["C\u00f4te D Ivoire Vs Japan", "Fathers Day", "England vs Italy", "Uruguay Vs Costa Rica", "Colombia vs Greece", "Chile vs Australia", "Spain vs Netherlands", "Mexico vs Cameroon", "Fabregas", "SuperSport", "World Cup 2014", "Yahoo Mail", "WhatsApp", "Yahoo", "Yahoo.com", "KRA", "Diego Costa", "Rihanna", "Madaraka Day", "Raila"], "36": ["\u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u0635\u062d\u0629", "\u0648\u0632\u0627\u0631\u0629 \u0627\u0644\u0635\u062d\u0629", "\u0645\u0628\u0627\u0631\u0627\u0629 \u0627\u0646\u062c\u0644\u062a\u0631\u0627 \u0648\u0627\u064a\u0637\u0627\u0644\u064a\u0627", "\u0633\u0627\u062d\u0644 \u0627\u0644\u0639\u0627\u062c \u0636\u062f \u0627\u0644\u064a\u0627\u0628\u0627\u0646", "\u0645\u0628\u0627\u0631\u0627\u0629 \u0627\u064a\u0637\u0627\u0644\u064a\u0627 \u0648\u0627\u0646\u062c\u0644\u062a\u0631\u0627", "\u0627\u064a\u0637\u0627\u0644\u064a\u0627 \u0648\u0627\u0646\u062c\u0644\u062a\u0631\u0627", "\u0643\u0648\u0633\u062a\u0627\u0631\u064a\u0643\u0627", "\u0645\u0628\u0627\u0631\u064a\u0627\u062a \u0643\u0627\u0633 \u0627\u0644\u0639\u0627\u0644\u0645", "\u0645\u0628\u0627\u0631\u0627\u0629 \u0627\u0646\u062c\u0644\u062a\u0631\u0627 \u0648\u0627\u064a\u0637\u0627\u0644\u064a\u0627", "\u0627\u064a\u0637\u0627\u0644\u064a\u0627", "\u0628\u064a\u0631\u0644\u0648", "\u0627\u0647\u062f\u0627\u0641 \u0643\u0627\u0633 \u0627\u0644\u0639\u0627\u0644\u0645 2014", "England vs Italy", "uruguay vs costa rica", "\u0625\u0646\u062c\u0644\u062a\u0631\u0627 \u0636\u062f \u0625\u064a\u0637\u0627\u0644\u064a\u0627", "\u062a\u0634\u064a\u0644\u064a \u0636\u062f \u0623\u0633\u062a\u0631\u0627\u0644\u064a\u0627", "\u0643\u0648\u0644\u0648\u0645\u0628\u064a\u0627 \u0636\u062f \u0627\u0644\u064a\u0648\u0646\u0627\u0646", "\u0641\u0627\u0646 \u0628\u064a\u0631\u0633\u064a", "\u0627\u0647\u062f\u0627\u0641 \u0647\u0648\u0644\u0646\u062f\u0627 \u0648\u0627\u0633\u0628\u0627\u0646\u064a\u0627", "\u0628\u062b \u0645\u0628\u0627\u0634\u0631 \u0645\u0628\u0627\u0631\u0627\u0629 \u0627\u0633\u0628\u0627\u0646\u064a\u0627 \u0648\u0647\u0648\u0644\u0646\u062f\u0627"], "35": ["\u041a\u043e\u0442-\u0434 \u0418\u0432\u0443\u0430\u0440 \u2013 \u042f\u043f\u043e\u043d\u0438\u044f", "\u0413\u0440\u043e\u043c\u0430\u0434\u0441\u044c\u043a\u0435", "\u0410\u043d\u0433\u043b\u0438\u044f \u2013 \u0418\u0442\u0430\u043b\u0438\u044f", "\u0418\u043b 76", "\u0423\u0440\u0443\u0433\u0432\u0430\u0439 \u2013 \u041a\u043e\u0441\u0442\u0430-\u0440\u0438\u043a\u0430", "\u0427\u0438\u043b\u0438 \u2013 \u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f", "\u041a\u043e\u043b\u0443\u043c\u0431\u0438\u044f \u2013 \u0413\u0440\u0435\u0446\u0438\u044f", "\u0413\u043e\u0440\u043b\u043e\u0432\u043a\u0430", "\u041f\u043e\u0441\u043e\u043b\u044c\u0441\u0442\u0432\u043e \u0420\u043e\u0441\u0441\u0438\u0438 \u0432 \u041a\u0438\u0435\u0432\u0435", "\u0418\u0441\u043f\u0430\u043d\u0438\u044f \u2013 \u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b", "\u0424\u0443\u0442\u0431\u043e\u043b", "\u041c\u0430\u0440\u0438\u0443\u043f\u043e\u043b\u044c", "\u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u041c\u0438\u0440\u0430 \u041f\u043e \u0424\u0443\u0442\u0431\u043e\u043b\u0443 2014 \u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u041e\u043d\u043b\u0430\u0439\u043d", "\u0427\u043c 2014 \u041f\u043e \u0424\u0443\u0442\u0431\u043e\u043b\u0443", "\u0406\u0441\u043f\u0430\u043d\u0456\u044f \u2013 \u041d\u0456\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u0438", "\u0414\u0435\u043d\u044c \u043c\u0435\u0434\u0438\u043a\u0430", "2 2", "\u0434\u0435\u043c\u0430\u0440\u0448", "\u042f\u043d\u0443\u043a\u043e\u0432\u0438\u0447", "\u043f\u044f\u0442\u043d\u0438\u0446\u0430 13"], "34": ["Father S Day", "Switzerland vs Ecuador", "France vs Honduras", "Fathers Day Wishes", "England vs Italy", "Uruguay vs Costa Rica", "C\u00f4te D Ivoire Vs Japan", "Colombia vs Greece", "Happy Fathers Day", "Father S Day 2014", "Argentina vs Bosnia and Herzegovina", "Fathers Day Quotes", "Now You See Me", "Spain vs Netherlands", "Mexico vs Cameroon", "Jennifer Lopez", "Chile vs Australia", "Fabregas", "Messi", "Germany World Cup 2014 Squad"], "33": ["\u0e44\u0e01\u0e48 \u0e20\u0e32\u0e29\u0e34\u0e15", "\u0e21\u0e27\u0e22\u0e44\u0e17\u0e227\u0e2a\u0e35", "\u0e2d\u0e31\u0e07\u0e01\u0e24\u0e29", "\u0e2d\u0e31\u0e07\u0e01\u0e24\u0e29 \u0e2d\u0e34\u0e15\u0e32\u0e25\u0e35", "\u0e2a\u0e40\u0e1b\u0e19 \u0e2e\u0e2d\u0e25\u0e41\u0e25\u0e19\u0e14\u0e4c", "\u0e2a\u0e40\u0e1b\u0e19 \u0e2e\u0e2d\u0e25\u0e41\u0e25\u0e19\u0e14\u0e4c", "\u0e2e\u0e2d\u0e25\u0e41\u0e25\u0e19\u0e14\u0e4c", "\u0e14\u0e39\u0e1a\u0e2d\u0e25", "\u0e0a\u0e48\u0e2d\u0e077", "\u0e1c\u0e25\u0e1a\u0e2d\u0e25\u0e42\u0e25\u0e01", "\u0e0a\u0e48\u0e2d\u0e075", "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01\u0e40\u0e04\u0e2d\u0e23\u0e4c\u0e1f\u0e34\u0e27", "\u0e40\u0e19\u0e22\u0e4c\u0e21\u0e32\u0e23\u0e4c", "World Cup 2014", "\u0e1f\u0e38\u0e15\u0e1a\u0e2d\u0e25\u0e42\u0e25\u0e01", "\u0e1c\u0e25\u0e1a\u0e2d\u0e25", "\u0e1a\u0e2d\u0e25\u0e42\u0e25\u0e01", "\u0e1a\u0e23\u0e32\u0e0b\u0e34\u0e25", "\u0e1a\u0e2d\u0e25\u0e42\u0e25\u0e01 2014", "World Cup"], "32": ["Uruguay Vs Costa Rica", "Inglaterra vs Italia", "Elecciones Presidenciales Colombia 2014", "Costa de Marfil", "Copa Mundial Colombia", "Andrea Pirlo", "David Ospina", "Teofilo Gutierrez", "Chile vs Australia", "M\u00e9xico vs Camer\u00fan", "Espa\u00f1a contra Pa\u00edses Bajos en Copa Mundial", "Seleccion Colombia", "Futbol En Vivo", "Espa\u00f1a contra Pa\u00edses Bajos", "Partidos del Mundial", "Cristiano Ronaldo", "Xabi Alonso", "Diego Costa", "Lina Luna", "Copa Mundial Espa\u00f1a"], "50": ["Costa Rica", "Alexander Stubb", "Chile vs. Australia", "NHL", "ZZ Top", "Espanja Vs. Alankomaat", "Claudia Leitte", "Stockmann", "Meksiko Vs. Kamerun", "Jessica Rabbit", "Ronaldo", "Hulk", "Messi", "Jennifer Lopez", "Neymar", "Brasilia", "Jao", "Slenderman", "AKT", "NHL"]};
      callback(data);*/

    }

    setTimeout(function() {
      getTerms(callback);
    }, 60 * 60 * 1000);

  }

  function init() {

    // Global resize
    $(window).bind('resize', _.debounce(onResize, 100));

    // No media query fallback
    if (!Modernizr.mq('only all')) {
      var mq = function() {
        $(document.body).toggleClass('small-window', $(window).innerWidth() <= SMALL_WINDOW)
      }
      $(window).bind('resize', mq);
      mq();
    }

    // Idle fade 
    resetIdleTimeout();
    $(document.body).mousemove(function() {
      document.body.classList.remove('idle');
      resetIdleTimeout();
    });

    // Analytics tracking for screensaver
    $('#screensaver-link').click(function() {
        _gaq.push(['_trackEvent', 'Screensaver', 'Download', 'Download']);
    });

    // ----------------------------------------------
    // 
    // Matrix Selector
    // 
    // ----------------------------------------------

    matrixSelect = generateTable(MAX_COLS, MAX_COLS);
    matrixSelect.id = 'matrix-select';

    var matrixSelectShowing = false;
    var $matrixSelectContainer = $('#matrix-select-container');

    $matrixSelectContainer.prepend(matrixSelect);

    $(matrixSelect).find('td').each(function(k, v) {

      var col = Math.floor(k / MAX_COLS);
      var row = k % MAX_COLS;

      // Hover highlight
      $(this).bind('mousemove', function(e) {
        e.preventDefault();
        highlightRows(col, row, 'highlight');
        return false;
      });

      // Set matrix
      $(this).bind('click', function(e) {
        e.preventDefault();
        setMatrix(col, row);

        //_gaq.push(['_trackEvent', 'Matrix', 'Change', (col+1) + 'x' + (row+1)]);
        updateURL();

        matrixSelectShowing = false;
        $matrixSelectContainer.removeClass('showing');
        resetIdleTimeout();
        return false;
      });
    });

    var openMatrixSelect = function() {
      highlightRows(0, 0, 'highlight');
      matrixSelectShowing = true;
      $matrixSelectContainer.addClass('showing');
    };

    $('#matrix-button').bind('click', openMatrixSelect)
    if (!Modernizr.touch) {
      $('#matrix-button').bind('mouseenter', openMatrixSelect)
    }

    $matrixSelectContainer.bind('mouseleave', function() {
      matrixSelectShowing = false;
      $matrixSelectContainer.removeClass('showing');
    });

    // ----------------------------------------------
    // 
    // Region Selector
    // 
    // ----------------------------------------------

    var $regionSelect = $('#region-select');
    $('#region').prepend($regionSelect);

    // Alphabetize region select, using locale specific sort.
    var items = $regionSelect.children('option.sort').get();
    items.sort(function(a, b) {

      // find portion of string following first capital letter.
      // (sort den Niederland as Niederland)
      var a = uppercasePortion($(a).text());
      var b = uppercasePortion($(b).text());
      return a.localeCompare(b);

    });

    function isUppercase(c) {
      return c != c.toLowerCase() && c == c.toUpperCase();
    }

    function uppercasePortion(str) {
      var s;
      for (var i = 0, l = str.length; i < l; i++) {
        if (isUppercase(str.charAt(i))) {
          s = i;
          break;
        }
      }
      if (s == undefined) {
        return str;
      }
      return str.substring(s)
    }

    $.each(items, function(k, v) { $regionSelect.append(v); });



    $regionSelect.change(function() {

      setRegion($(this).val());

      _gaq.push(['_trackEvent', 'Region', 'Change', $(this).val()]);
      updateURL();
 
    });

    function resetIdleTimeout() {
      
      if (Modernizr.touch || url.boolean('dev')) return;

      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(fadeIdleable, FADE_DELAY);

    }

  }
  
  function initializeMatrix() {

    matrix = generateMatrix(MAX_COLS, MAX_COLS);
    matrix.id = 'matrix';
    document.getElementById('matrix-container').appendChild(matrix);


    $(matrix)
      .find('.cell').each(function(k) {
        wipers.push(new Wiper(this, k));
      })

    setMatrix(url.int('r', 1)-1, url.int('c', 1)-1);
    setRegion(url.int('p', 0));

    lastUpdate = (+new Date());

    _.each(wipers, startLoop);

    update();

  }

  function startLoop(wiper) {

    wiper.numLoops = 0;

    var delayedNext = function() {
      wiper.timeout = setTimeout(wiper.next, WIPE_DELAY);
    };

    var reallyDelayedNext = function() {
      wiper.timeout = setTimeout(wiper.next, TITLE_DELAY);
    };

    wiper.next = function() {

      clearTimeout(wiper.timeout);

      if (showLogo(wiper)) {

        wiper.showArbitrary('<img src="/orangeroom/logo.png">', reallyDelayedNext)

      } else if (showTitle(wiper)) {
        wiper.typer.forceSpeed = 10;
        wiper.show(TITLE, reallyDelayedNext);
      } else { 
        wiper.typer.forceSpeed = 0;
        wiper.show(terms[++termIndex%terms.length], delayedNext);
      }

      wiper.numLoops++;

    };

    wiper.next();

  }

  function forceNext() {
    _.each(wipers, function(w) {
      if (w.next) w.next(); // meh
    });
  }

  function update() {
    requestAnimationFrame(update);
    now = (+new Date());
    _.each(wipers, updateWiper);
    lastUpdate = now;
  }

  function updateWiper(w) {
    if (!w.disabled) w.update(now - lastUpdate);
  }


  function generateMatrix(rows, cols) {

    var m = document.createElement('div');

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {

        var cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = 'cell-' + r + '-' + c;
        m.appendChild(cell);

      }
    }

    return m;

  }


  function setMatrix(r, c) {

    rows = Math.max(Math.min(r, MAX_COLS-1), 0);
    cols = Math.max(Math.min(c, MAX_COLS-1), 0);

    $(matrix).find('.cell').each(function(k, v) {

      var col = Math.floor(k / MAX_COLS);
      var row = k % MAX_COLS;

      if (row > rows || col > cols) {

        wipers[k].disabled = true;
        v.style.display = 'none';

      } else { 

        // Hm.
        if (wipers[k].disabled) wipers[k].onTransitionEnd();

        wipers[k].disabled = false;
        v.style.left = (col) / (cols+1) * 100 + '%';
        

        if (url.tsq == 'tower') {
          v.style.height = tsqTowerHeights[row] + 'px';
          v.style.top = tsqTowerTops[row] + 'px';
          v.style.width = '100%';

        } else if (url.tsq == 'marquee') {

          v.style.height = '100%';
          v.style.top = 0;
          v.style.left = tsqMarqueeLefts[col] + 'px';
          v.style.width = tsqMarqueeWidths[col] + 'px';

        } else { 
          v.style.height = 1 / (rows+1) * 101 + '%';
          v.style.top = (row) / (rows+1) * 100 + '%';
          v.style.width = 1 / (cols+1) * 101 + '%'; // hack for 1px line that shows up

        }


        v.style.display = 'block';
      }

    });
    
    onResize();
    highlightRows(rows, cols, 'select');

  }

  function setRegion(p) {

    var termsRaw;
    pipe = p;
    
    // all regions
    if (p == 0 || !(p in termsByRegion)) {
      termsRaw = _.flatten(termsByRegion);
    } else { 
      termsRaw = termsByRegion[p];
    }

    terms = _.shuffle(_.uniq(termsRaw));

    // Update display

    $selected = $("#region-select option[value='"+p+"']");
    $("#region-select").val(p);
    $("#region span").html($selected.html());

    $("#region-select").width($("#region span").width());

    forceNext();

  }


  function fadeIdleable() {
    document.body.classList.add('idle'); 
  }

  function generateTable(rows, cols) {

    var table = document.createElement('table');

    for (var r = 0; r < rows; r++) {
      var row = document.createElement('tr');
      table.appendChild(row);
      for (var c = 0; c < cols; c++) {

        var cell = document.createElement('td');
        row.appendChild(cell);

      }
    }

    return table;

  }

  function updateURL() {
    
    var args = {};
    if (rows != 0) args.r = rows+1;
    if (cols != 0) args.c = cols+1;
    if (pipe != 0) args.p = pipe;
    if (url.hl) args.hl = url.hl;

    var str = [];
    _.each(args, function(v, k) {
      str.push(k +'=' + v);
    })

    str = str.join('&');

    if (Modernizr.history) {
      history.replaceState({}, '', '?' + str);
    } else { 
      window.location = '?' + str;
    }

    if (parent && parent.postMessage) {
      parent.postMessage('?' + str, "*");
    }

    // if (parent.document.updateUrl) {
    //   parent.document.updateUrl(rows+1, cols+1, pipe)
    // }  

  }

  function onResize() {

    _.each(wipers, function(w) {
      w.onResize();
    });

    var cellWidth = container.innerWidth/(cols+1);
    var cellHeight = container.innerHeight/(rows+1);

    // if (cellWidth > 1280 || cellHeight > 800) {
    //   disableBlur();
    // } else { 
    //   enableBlur();
    // }

  }


  function highlightRows(cols, rows, className) {

    $(matrixSelect).find('td').each(function(k, v) {

      var col = Math.floor(k / MAX_COLS);
      var row = k % MAX_COLS;

      if (col <= cols && row <= rows) {
        $(this).addClass(className);
      } else { 
        $(this).removeClass(className);
      }

    });

  }

})();
