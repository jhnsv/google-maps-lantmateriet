# Integritetspolicy

**Senast uppdaterad:** 2026-11-07

Google Maps till Min Karta har ingen egen server och använder inte analys,
annonsering eller telemetri.

## Vilka uppgifter behandlas?

När användaren själv klickar på **Öppna i Lantmäteriet** läser tillägget
koordinater från den aktuella Google Maps-sidan. Koordinaterna konverteras
lokalt i webbläsaren från geografiska koordinater till SWEREF 99 TM.

Koordinatparet sparas tillfälligt i Firefox-tilläggets lokala lagring för att
kunna överföras från Google Maps-fliken till en ny Min Karta-flik. Tillägget
öppnar därefter Lantmäteriets Min Karta och fyller i koordinaterna för att
genomföra sökningen. Den tillfälliga uppgiften tas bort när sökningen har
initierats.

## Delas uppgifter med tredje part?

Ja. När användaren väljer funktionen öppnas Lantmäteriets Min Karta och
koordinaterna används där för att söka efter platsen. Uppgifterna skickas
därmed till Lantmäteriets webbplats som en del av användarens uttryckliga
åtgärd. Tillägget skickar inte koordinaterna till utvecklaren eller någon
annan egen server.

Google Maps tillhandahåller sidan från vilken koordinaterna läses. Tillägget
har ingen separat funktion för att skicka uppgifter till Google.

## Lagring och gallring

Koordinaterna lagras tillfälligt med Firefox `storage.local` för att överföra
dem mellan flikarna. De tas bort efter att sökningen har initierats. En
överbliven överföring kan finnas kvar en kort tid om fliken stängs oväntat;
den ignoreras efter tre minuter.

## Kontakt

Frågor och felrapporter hanteras via projektets GitHub Issues.
