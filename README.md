# Google Maps till Min Karta

Ett Firefox-tillägg som låter dig öppna en vald punkt i Google Maps direkt i
Lantmäteriets Min Karta. Tillägget hämtar koordinaterna från Google Maps,
räknar om dem till SWEREF 99 TM och startar en sökning i Min Karta.

> **Status:** fungerande utvecklingsversion 1.7.6. Projektet är ännu inte
> granskat eller publicerat på Firefox Add-ons (AMO).

## Funktioner

- Lägger till **Öppna i Lantmäteriet** i Google Maps platsinformation.
- Stöd för företags-/adresskort och vanliga kartnålar.
- Konverterar WGS84-koordinater till SWEREF 99 TM lokalt i webbläsaren.
- Öppnar Min Karta och fyller i koordinaterna samt initierar sökningen.

## Installation för utveckling (Firefox)

1. Hämta eller klona repositoryt.
2. Öppna `about:debugging#/runtime/this-firefox` i Firefox.
3. Välj **Läs in tillfälligt tillägg…** (*Load Temporary Add-on…*).
4. Välj `extension/manifest.json`.
5. Öppna eller ladda om Google Maps.

Tillfälligt inlästa tillägg tas normalt bort när Firefox startas om. Detta är
utvecklarinstallation, inte den slutliga användarinstallationen.

## Projektstruktur

```text
extension/
  manifest.json
  background.js
  google-maps.js
  min-karta.js
  README.txt
```

## Integritet

Tillägget använder koordinater från den aktuella Google Maps-sidan när
användaren själv klickar på länken. Koordinaterna räknas om lokalt och skickas
till Lantmäteriets Min Karta för att utföra sökningen.

Projektet har ingen egen analys, annonsering eller telemetri. Se
[PRIVACY.md](PRIVACY.md) för mer information.

## Kända begränsningar

- Google Maps och Min Karta är webbappar vars interna HTML och gränssnitt kan
  ändras. Sådana ändringar kan göra att tilläggets placering eller automatiska
  sökning behöver uppdateras.
- Projektet är oberoende och inte anslutet till, godkänt av eller sponsrat av
  Google eller Lantmäteriet.
- Version 1.7.6 är testad manuellt i den utvecklingsmiljö som användes under
  utvecklingen. Den är inte ännu godkänd av Mozilla.

## Rapportera problem

Skapa ett GitHub Issue och beskriv:
- Firefox-version och operativsystem.
- Om det gäller en vanlig kartnål, adress eller företagskort.
- Vad du förväntade dig och vad som hände.
- Skärmbild eller relevant HTML om möjligt.

Dela inte känslig platsinformation i publika issues.

## Licens

Ingen öppen källkodslicens har ännu valts. Tills en licens läggs till gäller
upphovsrättens standardregler; publicering av källkoden innebär inte i sig att
andra får återanvända eller distribuera den.
