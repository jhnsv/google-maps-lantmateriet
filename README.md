# Google Maps till Min Karta

Ett Firefox-tillägg som låter dig öppna en vald punkt i Google Maps direkt i Lantmäteriets Min Karta. Tillägget hämtar koordinaterna från Google Maps, räknar om dem till SWEREF 99 TM och startar en sökning i Min Karta.

> **Version:** 1.7.7 – kandidat för egen distribution. Inte ännu signerad av Mozilla.

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

Tillfälligt inlästa tillägg tas normalt bort när Firefox startas om. Detta är utvecklarinstallation, inte den slutliga användarinstallationen.

## Projektstruktur

```text
extension/
  manifest.json
  background.js
  google-maps.js
  min-karta.js
  README.txt
updates.json
LICENSE
PRIVACY.md
CHANGELOG.md
```

## Egen distribution och uppdateringar

Tillägget är förberett för egen distribution via Mozilla-signerade XPI-filer. Uppdateringsadressen är `https://raw.githubusercontent.com/jhnsv/google-maps-lantmateriet/main/updates.json`. Den filen måste uppdateras med den signerade XPI-filens HTTPS-adress och SHA-256-hash efter varje Mozilla-signering. Lägg den signerade XPI-filen i en GitHub Release med ett versionsnummer som matchar manifestet.

**Viktigt:** Den här källkodsversionen är inte i sig en signerad installationsfil. Firefox kräver en Mozilla-signerad XPI för normal distribution.

## Integritet

När användaren själv klickar på **Öppna i Lantmäteriet** läser tillägget koordinater från den aktuella Google Maps-sidan. Koordinaterna räknas om lokalt och skickas till Lantmäteriets Min Karta för sökningen. Tillägget har ingen egen analys, annonsering eller telemetri. Se [PRIVACY.md](PRIVACY.md).

## Kända begränsningar

- Google Maps och Min Karta är webbappar vars interna HTML och gränssnitt kan ändras. Sådana ändringar kan göra att tilläggets placering eller automatiska sökning behöver uppdateras.
- Projektet är oberoende och inte anslutet till, godkänt av eller sponsrat av Google eller Lantmäteriet.
- Version 1.7.7 är en testkandidat och ännu inte signerad av Mozilla.

## Rapportera problem

Skapa ett GitHub Issue och beskriv Firefox-version, operativsystem, vilken typ av plats du testade och vad som hände. Dela inte känslig platsinformation i publika issues.

## Licens

Projektet distribueras under MIT License. Se [LICENSE](LICENSE).
