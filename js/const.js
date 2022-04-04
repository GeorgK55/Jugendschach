
//const NEWLINE_REPRESENTATIONS   = "(\n)|(\r\n)|(\n\r)";

const FEN_PARTIEANFANG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// Diese ActionContext gibt es:
const AC_GAMEIMPORT				= "GameImport";
const AC_CHALLENGE_PLAY			= "SolveChallengePlay";
const AC_CHALLENGE_RATING		= "SolveChallengeRating";
const AC_CHALLENGE_Varianten	= "SolveChallengeVarianten";
const AC_ENGINEDIALOG			= "EngineDialog";

// ActionSteps für AC_GAMEIMPORT
const AS_IDENTIFYUNIQUEMOVE 	= "ExpectPossibleMoves";
const AS_INTERPRETELOCATEDMOVE		= "ExpectMoveFinished";
const AS_FINISHPOSSIBLEMOVESIDENTIFICATION	= "FinishPossibleMoves";

// ActionSteps für AC_CHALLENGE_PLAY
const AS_CHECKCHALLENGEMOVE				= "CheckMove";
const AS_CHECKCHALLENGEMOVEFINISHED		= "CheckMoveFinished";
const AS_GETCHALLENGEFEN				= "GetFEN";
const AS_DRAWCHALLENGEENGINEMOVE		= "GetEngineMove";
const AS_FINISHCHALLENGEENGINEMOVE		= "FinishEngineMove";


// ActionSteps für AC_CHALLENGE_RATING
const AS_PREPAREMOVE			= "PrepareMove";
const AS_PREPAREMOVEFINISHED	= "PrepareMoveFinished";
const AS_SIMULATEPLAYERMOVE		= "SimulatePlayerMove";
const AS_FINISHPLAYERMOVE		= "FinishPlayerMove";
const AS_DRAWRATINGENGINEMOVE	= "DrawRatingEngineMove";
const AS_FINISHRATINGENGINEMOVE	= "FINISHRatingEngineMove";

// ActionSteps für AC_CHALLENGE_Varianten
const AS_CV_VERIFYMOVE			= "CV_VerifyMove";
const AS_CV_VERIFYMOVEFINISHED	= "CV_VerifyMoveFinished";
const AS_CV_DRAWVariantenMOVE	= "CV_DrawVariantenMove";

const WEISSAMZUG		= "weiß";
const SCHWARZAMZUG		= "schwarz";
const ZIEHT				= "-";
const SCHLÄGT			= "x";
const MATT				= "#";

const SPIELER = "spieler";
const AUFGABE = "aufgabe";

const ALLEAUFGABENANZEIGEN 	= -1;
const THEMA0AUFGABENANZEIGEN = 0;

const MATCH_MOVES       = "(\n\n[\\s\\S]*)|(\r\n\r\n[\\s\\S]*)|(\n\r\n\r[\\s\\S]*)";
const r_Match_Moves     = new RegExp(MATCH_MOVES, "mg");

// Bei einer mit schwarz beginnenden Variante werden die drei Punkte für weiss eventuell direkt angehängt. Werden hier getrennt
const r_Punkte 				= new RegExp("(\\d{1,2})(\\.{3})", "g");

// Hinter öffnende und vor schließende Klammern ein Blank einfügen damit die Klammern sicher ein eigenes Splitelement werden.
const r_KlammernAuf 			= new RegExp("([\\[\\{\\(])", "g");
const r_KlammernZu  			= new RegExp("([\\]\\}\\)])", "g");
// Aufeindanderfolgende Klammern zusätzlich trennen
const r_KlammernZuAuf 			= new RegExp("([\\)])([\\(])", "g");

// Je nach Exporteinstellungen kann es sein, dass die weißen Züge direkt hinter den Zugnummern stehen, Trennen.
const r_Zugnummern 			= new RegExp("(\\d{1,2}\\.{1})([abcdefgh]{1}|[KDTSL]{1})|(\\d{1,2}\\.{1})(0{1})", "g");

// Alle unterschiedlichen Darstellungen für Züge
const r_BauerKurzeNotation =   new RegExp("^(?<mitfile>[abcdefgh]{0,1})"						+
												"(?<capture>[x]{0,1})"						+
												"(?<targetfile>[abcdefgh]{1})"				+
												"(?<targetrank>[12345678]{1})"				+
												"(?<umwandlung0>[=]{0,1})"					+
												"(?<umwandlung>[DTSLQRNBdtslqrnb]{0,1})"	+
												"(?<schachodermatt>[+#]{0,1})");

const r_FigurKurzeNotation =	 new RegExp("^(?<figur>[KDTSLQRNB]{1})"						+ 
												"(?<mitfile>[abcdefgh]{0,1})"				+
												"(?<mitrank>[12345678]{0,1})"				+ 
												"(?<capture>[x]{0,1})"						+ 
												"(?<targetfile>[abcdefgh]{1})"				+
												"(?<targetrank>[12345678]{1})"				+
												"(?<umwandlung0>[=]{0,1})"					+
												"(?<umwandlung>[DTSLQRNBdtslqrnb]{0,1})"	+
												"(?<schachodermatt>[+#]{0,1})");
											
// Die Darstellungen der Rochaden
const r_Rochaden = new RegExp("^(O-O-O)|(O-O)");

// Zugnummern
const r_Zugnummer = new RegExp("^\\d{1,2}\\.{1}$");

const r_bestmove = new RegExp("bestmove (?<movevon>[abcdefgh]{1}[12345678]{1})(?<movenach>[abcdefgh]{1}[12345678]{1})(?<umwandlung>[QqRrBbNn]{0,1})");

const DefaultFEN	= "&nbsp;";
const DefaultMove_w = "...";
const DefaultMove_b = "&nbsp;";
const NodePräfix 	= "N_";
const MovePräfix 	= "M_";
const TooltipPräfix	= "T_";
const WhitePostfix 	= "_w";
const BlackPostfix 	= "_b";

const VarianteZeiger = "&#9759;";

const ANSWERVARIANTE	= 'Variante';
const ANSWERHAUPTZUG	= 'Hauptzug';
const ANSWERERROR		= 'FalscherZug';

const MiniBoardArray = [
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"<div class='cB_s'></div>",
"<div class='cB_w'></div>",
"</div>"
];

const MiniBoard = 
"<div class=&apos;chessboardMini&apos;>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"<div class=&apos;cB_s&apos;></div>"+
"<div class=&apos;cB_w&apos;></div>"+
"</div>";
