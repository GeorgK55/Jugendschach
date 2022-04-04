
// Für den gespielten Zug wird zuerst geprüft, ob er in der Aufgabenstellung an der aktuellen Stelle überhaupt vorgesehen ist. 
// Ist das nicht der Fall, wird das promise mit reject zurückgewiesen
// Ist der gespielte Zug der einzig vorgesehene, werden die Daten des entsprechenden Zugs aus der Aufgabenstellung übernommen
// Ist der gespielte Zug mehrdeutig (= es gibt Varianten für den Spieler), werden dem Spieler Züge vorgeschlagen.
// Der Spieler muss sich für einen Zug entscheiden (dann werden die Daten des gewünschten Zugs aus der Aufgabenstellung übernommen)
// oder den Zug zurücknehmen.
function inspectPlayerMove() {

    console.log('Beginn in ' + getFuncName());
    var ValidatePlayerAnswer = $.Deferred();

    // DrawnMove und MainMove sind immer eindeutig 
    PossibleMoves   = $.grep(ChallengeMoves, function(CM, i) { return CM['PreMoveId'] == Stellungsdaten.CurMoveId; });
    DrawnMove       = $.grep(PossibleMoves,  function(PM, i) { return PM['ZugStockfish'] == T_Zuege.ZugStockfish; });
    MainMove        = $.grep(PossibleMoves,  function(PM, i) { return parseInt(PM['ZugLevel']) == parseInt(Stellungsdaten.ZugLevel); });

    if(DrawnMove.length == 0) {

        console.log('reject bei DrawnMove.length == 0' + ' mit: ', T_Zuege);
        ValidatePlayerAnswer.reject({ weiter: ANSWERERROR, zug: T_Zuege});

    } else if (PossibleMoves.length == 1) { // Das muss dann zwingend der Hauptzug sein, sonst wäre die PGN falsch

        TransferZugdaten(Stellungsdaten, DrawnMove[0]);
        AcceptedPlayerMove = DrawnMove[0];
        console.log('resolve bei PossibleMoves.length == 1' + ' mit: ', T_Zuege);
        ValidatePlayerAnswer.resolve({ weiter: ANSWERHAUPTZUG, zug: DrawnMove[0]});

    } else if (parseInt(DrawnMove[0].ZugLevel) > parseInt(Stellungsdaten.ZugLevel)) { // Variante gezogen
        
        //PlayerMainMoveToStack(MainMove[0]);
        PlayerVariationMovesToStack(MainMove[0], [], DrawnMove[0]);

        offerPlayerVariationMoveStart(DrawnMove[0].Id).then( function(decision) 
        {
            AcceptedPlayerMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug; })[0];
            console.log(Stellungsdaten);
            console.table(Stellungsdaten.ZugStack);
            TransferZugdaten(Stellungsdaten, MainMove[0]);
            if(decision.weiter == 'Variante') {
                NewTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, MainMove[0], false);
                Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
            }
            TransferZugdaten(Stellungsdaten, AcceptedPlayerMove);
            console.log('resolve in offerPlayerVariationMoveStart mit: ', decision);
            ValidatePlayerAnswer.resolve(decision);

        }, function(decision) 
        {
            console.log('reject offerPlayerVariationMoveStart mit: ', decision);
            ValidatePlayerAnswer.reject(decision);
        });

    } else { // Hauptzug gezogen

        PlayerVariationMovesToStack(MainMove[0], PossibleMoves, DrawnMove[0]);

        offerPlayerMainMoveStart(DrawnMove[0].Id).then( function(decision) 
        {
            AcceptedPlayerMove = $.grep(ChallengeMoves, function(CMI, i) { return CMI['CurMoveId'] == decision.zug; })[0];
            console.log(Stellungsdaten);
            console.table(Stellungsdaten.ZugStack);
            TransferZugdaten(Stellungsdaten, MainMove[0]);
            if(decision.weiter == 'Variante') {
                NewTreeNode('TreeNotationslistePlayChallenge', 'sign', Stellungsdaten, MainMove[0], false);
                Stellungsdaten.PreNodeId = Stellungsdaten.CurNodeId;
            }
            TransferZugdaten(Stellungsdaten, AcceptedPlayerMove);
            console.log('resolve in offerPlayerMainMoveStart mit: ', decision);
            ValidatePlayerAnswer.resolve(decision);

        }, function(decision) 
        {
            console.log('reject in offerPlayerMainMoveStart mit: ', decision);
            ValidatePlayerAnswer.reject(decision);
        });

    }
    return ValidatePlayerAnswer.promise();
}

function offerPlayerMainMoveStart(ZugId) {

    console.log('Beginn in ' + getFuncName() + ' mit: ' + ZugId);

    var offerPlayerMainMoveStartAnswer = $.Deferred();
    processPlayerMainMoveStartOfferAnswer = new $.Deferred(); // Hier, da die Funktion sich rekursiv aufruft

    processPlayerMainMoveStartOffer(ZugId).then(function(decision) 
    {
        // Es gab die Entscheidung für eine Variante. Der gewählte Variantenzug ist Teil des Rückgabestrings decision
        console.log('resolve in processPlayerMainMoveStartOffer mit: ', decision);
        offerPlayerMainMoveStartAnswer.resolve(decision);

    } , function(decision) 
    {
        console.log('reject in processPlayerMainMoveStartOffer mit: ', decision);
        offerPlayerMainMoveStartAnswer.reject(decision);
    });
    return offerPlayerMainMoveStartAnswer.promise();
}

function offerPlayerVariationMoveStart(ZugId) {

    console.log('Beginn in ' + getFuncName() + ' mit: ' + ZugId);

    var OfferPlayerVariationMoveStartAnswer = $.Deferred();
    processPlayerVarianteMoveStartOfferAnswer = new $.Deferred(); // Hier, da die Funktion sich rekursiv aufruft

    processPlayerVarianteMoveStartOffer(ZugId).then(function(decision) 
    {
        // Es gab die Entscheidung für eine Variante. Der gewählte Variantenzug ist Teil des Rückgabestrings decision
        console.log('resolve in processPlayerVarianteMoveStartOffer mit: ', decision);
        OfferPlayerVariationMoveStartAnswer.resolve(decision);

    } , function(decision) 
    {
        console.log('reject in processPlayerVarianteMoveStartOffer mit: ', decision);
        OfferPlayerVariationMoveStartAnswer.reject(decision);
    });
    return OfferPlayerVariationMoveStartAnswer.promise();
}

function offerPlayerVariationsEnde() { 

    console.log('Beginn in ' + getFuncName());

    var offerPlayerVariationsEndeAnswer = $.Deferred();
    processPlayerEndeOfferAnswer = new $.Deferred();

    var EndMove = $.grep(ChallengeMoves, function(EM, i) { return EM['CurMoveId'] == Stellungsdaten.CurMoveId; })[0];   // soll konstant im Dialog angezeigt werden

    processPlayerEndeOffer(EndMove).then( function(decision) {

        console.log('resolve in processPlayerEndeOffer mit: ', decision);
        offerPlayerVariationsEndeAnswer.resolve(decision);

    }, function(decision) {

        console.log('reject in processPlayerEndeOffer mit: ', decision);
        offerPlayerVariationsEndeAnswer.reject(decision);

    });
    return offerPlayerVariationsEndeAnswer.promise();
}

// Überträgt alle Kandidatenzüge in den Stack. Reihenfolge siehe Kommentare im Code. ZeigeZug ist konstant true
function PlayerVariationMovesToStack(Hauptzug, Variantenzuege, Spielerzug) {

    console.log('Beginn in ' + getFuncName() + ' mit: ', Hauptzug, Variantenzuege, Spielerzug);

    // Den Hauptzug in den Stack. Gilt immer, auch wenn der Spieler diesen ausgeführt hatte
    Stellungsdaten.ZugStack.push( { 
        PreFEN:     Stellungsdaten.PreFEN,
        FEN:        Stellungsdaten.FEN,
        Farbe:      Hauptzug.ZugFarbe,
        PreNode:    Stellungsdaten.PreNodeId, 
        CurNode:    NodePräfix + Hauptzug.CurMoveIndex, 
        PreMove:    Hauptzug.PreMoveId, 
        CurMove:    Hauptzug.CurMoveId, 
        MoveIndex:  Hauptzug.CurMoveIndex,
        MoveLevel:  Hauptzug.ZugLevel,
        ChildMove:  "" ,
        ZeigeZug:   true
    });
    //console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
    //console.log(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].CurMove);
    NextIdToPlay = Hauptzug.CurMoveId; // wird überschrieben, wenn der Spieler einen Variantenzug ausgeführt hatte

    // Jetzt alle Züge bis auf den eventuell ausgeführten in den Stack. Rückwärts, ist ja ein Stack
    for (let i = Variantenzuege.length-1; i >= 0; i--) {

            if(Variantenzuege[i].ZugStockfish != Hauptzug.ZugStockfish) { // Der Hauptzug steht schon im Stack
            if(Variantenzuege[i].ZugStockfish == Spielerzug.ZugStockfish) { // Der gespielte Zug soll noch nicht in den Stack
                NextIdToPlay = Variantenzuege[i].CurMoveId;
            } else {
                // Die Situation VOR dem Variantenzug in den Stack
                Stellungsdaten.ZugStack.push( { 
                    PreFEN:     Stellungsdaten.PreFEN,
                    FEN:        Stellungsdaten.FEN,
                    Farbe:      Hauptzug.ZugFarbe,
                    PreNode:    Stellungsdaten.PreNodeId, 
                    CurNode:    NodePräfix + Hauptzug.CurMoveIndex, 
                    PreMove:    Hauptzug.PreMoveId, 
                    CurMove:    Hauptzug.CurMoveId, 
                    MoveIndex:  Hauptzug.CurMoveIndex,
                    MoveLevel:  Hauptzug.ZugLevel, 
                    ChildMove:  Variantenzuege[i].CurMoveId,
                    ZeigeZug:   true 
                });
                //console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
                //console.log(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].ChildMove);
            }
        }
    }    

    // Jetzt noch einen eventuell ausgeführten Variantenzug in den Stack, damit er zuerst angeboten wird
    if(NextIdToPlay != Hauptzug.CurMoveId) {
        Stellungsdaten.ZugStack.push( { 
            PreFEN: Stellungsdaten.PreFEN,
            FEN:        Stellungsdaten.FEN,
            Farbe:      Hauptzug.ZugFarbe,
            PreNode:    Stellungsdaten.PreNodeId, 
            CurNode:    NodePräfix + Hauptzug.CurMoveIndex, 
            PreMove:    Hauptzug.PreMoveId, 
            CurMove:    Hauptzug.CurMoveId, 
            MoveIndex:  Hauptzug.CurMoveIndex,
            MoveLevel:  Hauptzug.ZugLevel, 
            ChildMove:  NextIdToPlay,
            ZeigeZug:   true 
        });
        //console.table(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1]);
        //console.log(Stellungsdaten.ZugStack[Stellungsdaten.ZugStack.length-1].ChildMove);
    }
      
} 

// Nur den Hauptzug in den Stack. ZeigeZug ist konstant false
function PlayerMainMoveToStack(Hauptzug) {

    console.log('Beginn in ' + getFuncName() + ' mit: ', Hauptzug);

    Stellungsdaten.ZugStack.push( { 
        PreFEN:     Stellungsdaten.PreFEN,
        FEN:        Stellungsdaten.FEN,
        Farbe:      Hauptzug.ZugFarbe,
        PreNode:    Stellungsdaten.PreNodeId, 
        CurNode:    NodePräfix + Hauptzug.CurMoveIndex, 
        PreMove:    Hauptzug.PreMoveId, 
        CurMove:    Hauptzug.CurMoveId, 
        MoveIndex:  Hauptzug.CurMoveIndex,
        MoveLevel:  Hauptzug.ZugLevel,
        ChildMove:  "" ,
        ZeigeZug:   false
    });
}