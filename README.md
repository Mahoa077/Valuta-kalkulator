

# Valuta-kalkulator

Dette er en webaplikasjon som konverterer valutaen i santid ved bruk av ExchangeRate-API. 
I dette prosjektet bruker jeg frontend og backend, de er separerte men blir koblet sammen gjennom en client server arkitektur. 

# Brukermanual: 

1. starte frontend :
Åpne prosjektet i VScode og start index html med live server. 
Eksempel: http://127.0.0.1:5500 

2. Starte backend server : 
Gå inn i server mappen i terminalen via å skrive cd server
Så start serveren via å skrive node server.js 
Dette skal vises når serveren kjører: Server kjører på port 3000 

# Hvordan man bruker selve Valuta-kalkulatoren i nettsiden 

1. Skriv inn det beløpet du ønsker å konvertere i det hvite feltet
2. Velg den valutaen du vil konvertere fra i det nest øverste feltet 
3. Velg hvilken valuta du vil konvertere til fra det tredje feltet
4. Så trykk på konverter for å få opp hvor mye det er i den nye kursen 
5. Se under konverter knappen, der skal du se hvor mye det ble i den nye kursen 


# Funksjonene denne webaplikasjonen har er: 

Konvertering mellom flere valutaer 
Caching av API-data i serverCache.json
Backend med Node.js og Express
Oppdaterer valutakurser etter en hvis satt tid
Hover-effekt og interaktiv UI
Response og brukervennelig design 
Dynamisk bakgrunn basert på hvilken valuta du konverterer til 

# Teknologien jeg har brukt:
# Frontend: 
HTML
CSS
Javascript 
Frontenden håndterer da disse punktene:
Brukergrensersnitt 
Input-feltene 
Dropdown-menyene 
Fetch requestene som går til backenden 

# Backend 
Node.js 
Express.js
Backenden håndterer disse punktene: 
API-kall 
Caching
Ruting 
Kommunikasjonen med frontenden

# API 
Prosjektet mitt bruker kun ExchangeRate-API for å hente oppdaterte valutakurser 

# Caching 
Jeg bruker Caching for å redusere API-kall, slik at jeg ikke går tom for api-kall. 
Når man henter en valutakurs så blir den lagret i serverCaching.json. 
Det som skjer da er at hver gang sjekker backend cache før det blir sendt et nytt API-kall. Dette er for å forhindre unødvendige mange api kall. 



