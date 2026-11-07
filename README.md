# Google Maps till Min Karta

Ett Firefox-tillägg som låter dig öppna en vald plats i Google Maps direkt i Lantmäteriets **Min Karta**.

Tillägget hämtar koordinaterna från Google Maps, konverterar dem från WGS84 till SWEREF 99 TM och öppnar platsen i Min Karta.

> **Aktuell version:** 1.7.8  
> **Status:** Godkänt och signerat av Mozilla. Distribueras via GitHub Releases med stöd för automatiska uppdateringar.

## Funktioner

- Lägger till **Öppna i Lantmäteriet** i Google Maps platsinformation.
- Stöd för företagskort, adresskort och vanliga kartnålar.
- Konverterar WGS84-koordinater till SWEREF 99 TM lokalt i webbläsaren.
- Öppnar Lantmäteriets Min Karta och fyller i koordinaterna automatiskt.
- Startar sökningen direkt så att rätt plats visas på kartan.

## Installation

1. Gå till [Releases](https://github.com/jhnsv/google-maps-lantmateriet/releases).
2. Öppna den senaste versionen.
3. Ladda ner XPI-filen.
4. Öppna Firefox och gå till `about:addons`.
5. Klicka på kugghjulet och välj **Installera tillägg från fil**.
6. Välj den nedladdade XPI-filen.

Tillägget är signerat av Mozilla och kan installeras direkt i Firefox.

## Uppdateringar

Tillägget använder en egen uppdateringslösning via GitHub Releases.

Firefox kontrollerar automatiskt om en ny version finns tillgänglig och kan installera uppdateringen utan att användaren behöver ladda ner och installera tillägget på nytt.

Uppdateringsinformationen finns i [`updates.json`](https://github.com/jhnsv/google-maps-lantmateriet/blob/main/updates.json).

## Funktion och integritet

Tillägget använder koordinater från den aktuella Google Maps-sidan när användaren själv klickar på länken **Öppna i Lantmäteriet**.

Koordinaterna konverteras lokalt i webbläsaren och skickas vidare till Lantmäteriets Min Karta för att utföra sökningen.

Projektet har ingen egen analys, annonsering eller telemetri.

Se [PRIVACY.md](PRIVACY.md) för mer information.

## Utveckling

För att testa tillägget lokalt i Firefox:

1. Hämta eller klona repositoryt.
2. Öppna `about:debugging#/runtime/this-firefox` i Firefox.
3. Välj **Läs in tillfälligt tillägg…** (*Load Temporary Add-on…*).
4. Välj `extension/manifest.json`.
5. Öppna eller ladda om Google Maps.

Tillfälligt inlästa tillägg tas normalt bort när Firefox startas om. Detta är en utvecklingsinstallation och inte den avsedda användarinstallationen.

### Projektstruktur

```text
extension/
  manifest.json
  background.js
  google-maps.js
  min-karta.js
  README.txt

updates.json
PRIVACY.md
LICENSE
```

## Kända begränsningar

- Google Maps och Min Karta är webbappar vars interna HTML och gränssnitt kan ändras. Sådana ändringar kan göra att tilläggets placering eller automatiska sökning behöver uppdateras.
- Projektet är oberoende och inte anslutet till, godkänt av eller sponsrat av Google eller Lantmäteriet.

## Rapportera problem

Om du hittar ett problem får du gärna skapa ett [GitHub Issue](https://github.com/jhnsv/google-maps-lantmateriet/issues).

Beskriv gärna:
- Firefox-version och operativsystem.
- Om det gäller en vanlig kartnål, adress eller företagskort.
- Vad du förväntade dig och vad som hände.
- Skärmbild eller relevant HTML om möjligt.

Dela inte känslig platsinformation i publika issues.

## Licens

Projektet är licensierat under MIT License. Se [LICENSE](LICENSE) för fullständiga villkor.
