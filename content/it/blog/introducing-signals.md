---
title: Introduzione ai Signals
date: 2023-11-01
authors:
  - Marvin Hagemeister
  - Jason Miller
translation_by:
  - Francesco Luca Labianca
---

# Introduzione ai Signals

I Signals sono un modo di esprimere uno state che assicuri la velocità dell'applicazione a prescindere dalla sua complessità.
Si basano su principi di reattività, con un'implementazione unica ottimizzata per il Virtual DOM, fornendo un'eccellente esperienza per lo sviluppatore.

Nel loro core, un signal è un oggetto con una proprietà `.value` che contiene un valore. Il semplice accedere alla proprietà dall'interno di un componente, fà sì che questo venga aggiornato automaticamente quando il valore del signal cambia.

Oltre ad essere molto chiari e semplici da scrivere, la velocità di aggiornamento dello state viene garantita a prescindere dal numero di componenti che compongono la tua app. I Signals sono veloci di default, ottimizzando gli aggiornamenti dietro le quinte per te.


```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal, computed } from "@preact/signals";
 
const count = signal(0);
const double = computed(() => count.value * 2);
 
function Counter() {
  return (
    <button onClick={() => count.value++}>
      {count} x 2 = {double}
    </button>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

I Signals possono essere usati sia all'interno che all'esterno dei componenti, a differenza degli hooks. I Signals inoltre possono essere usati con gli hook **_e_** nei componenti stateful, possono quindi essere introdotti passo passo, utilizzando le tue conoscenze attuali. Provali su alcuni componenti e utilizzali gradualmente sempre più.

Oh, e comunque, restiamo fedeli al nostro principio di portarti le librerie il più piccole possibile. Usare i Signals in Preact aggiunge solo **1.6kB** al tuo bundle size.

Se vuoi già provarli, visita la nostra [documentazione](/guide/v10/signals) per approfondire.

## Quali problemi vengono risolti dai signals?

Negli anni passati abbiamo lavorato su un ampio spettro di app e teams, passando da piccole stratup fino a monoliti con centinaia di sviluppatori che lavoravano in contemporanea. In questi anni ognuno di noi, ha incontrato problematiche ricorrenti nel modo in cui lo state delle applicazioni viene gestito.

Soluzioni fantastiche sono state sviluppate per risolvere questi problemi, ma anche le soluzioni migliori continuano a richiedere un'integrazione manuale all'interno del framework. Come risultato, abbiamo notato l'esitazione degli sviluppatori nell'adottare tali soluzioni, continuando a preferire la gestione dello state fornita dai frameworks.

Abbiamo creato i Signals perché fossero una soluzione convincente, in grado di combinare prestazioni e un'ottima esperenzia dello sviluppatore per una perfetta integrazione nei framework.

## La lotta con il "global state"

Lo state iniziale di un'applicazione è sempre semplice, forse qualche "useState" è sufficiente, ma man mano che l'applicazione cresce, e con lei il numero di componenti che debbano accedere allo stesso state, questo viene normalmente portato in un componente che sia un genitore comune. E questo pattern viene ripetuto più volte, finché la maggior parte dello state finisce essendo vicino alla radice dell'albero dei componenti.

![Immagine che mostra come la profondità dell'albero dei componenti agisca direttamente sulle performance di rendering utilizzando gli aggiornamenti standard dello state.](/signals/state-updates.png)

Questo scenario pone in essere una sfida per i frameworks tradizionali basati sul Virtual DOM, che devono aggiornare l'intero albero "colpiti" da una modifica dello state. Di fatto, le performance di rendering dipendono direttamente dal numero di componenti presenti nell'albero. Possiamo aggirare parzialmente la problematica utilizzando `memo` o `useMemo` così che il framework riceva sempre gli stessi oggetti e quindi salti il rendering di alcune parti dell'albero.

Mentre questo possa sembrare teoricamente ragionevole, nella pratica spesso la situazione è più complessa.
In pratica, via via che il codice cresce, diventa complesso capire dove vadano inserite queste ottimizzazioni. Frequentemente, anche la memoizazzione con le intenzioni migliori può essere resa inefficace da valori di dipendenza instabili. Dato che gli hooks non hanno un albero delle dipendenze specifico, gli strumenti di analisi che aiutano gli sviluppatori hanno risultati instabili nel capire **_perché_** non tutto stia andando per il meglio.

## Context chaos

Un altro modo che i teams spesso utilizzano per aggirare il problema della condivisione dello state è quello di inserirlo dentro un context. Questo permette, potenzialmente, di saltare il rendering per i componenti in mezzo al provider e ai consumatori del context, ma c'è un problema: solo il valore che viene passato al context può essere aggiornato, e solo nel suo complesso. Aggiornare una proprietà di un oggetto esposto via context non aggiorna i suoi consumatori, aggiornamenti granulari non sono possibili.
Le opzioni disponibili sono quelle di dividere lo state in context multipli, o "sovra-modificare" l'oggetto clonandolo quando una qualsiasi delle sue proprietà cambi.

![Un context può saltare l'aggiornamento dei componenti fino a che si legge il suo valore, altrimenti si torna alla memoizzazione.](/signals/context-chaos.png)

Spostare i valori nei context può sembrare un buon compromesso all'inizio, ma la necessità di aumentare l'albero dei componenti solo per condividere dei valori prima o poi diventa un problema. La logica di business finisce inevitabilmente per dipendere da più context, il che ci costringe ad inserirlo in un punto specifico dell'albero. Aggiungere un componente che consumi un context nel mezzo dell'albero non è gratis in quanto riduce il numero di componenti per cui il rendering viene saltato quando il context viene aggiornato, in più, qualsiasi componente che sia discendente del consumatore adesso deve nuovamente essere renderizzato. L'unica soluzione a questo problema è un uso massiccio della memoizzazioni, il che ci riporta indietro ai problemi ad essa relativi.

## Alla ricerca di un modo migliore per gestire lo state

Siamo tornati alla lavagna per la ricerca di uno state primitivo di prossima generazione. Volevamo creare qualcosa che affrontasse simultaneamente tutti i problemi incontrati nelle attuali soluzioni: integrazioni manuali nel framework, sovra-dipendenza dalla memoizzazione, usi non ottimali dei context e la mancanza di osservabilità programmatica sono considerati come aspetti negativi.

Con queste strategie gli sviluppatori devono ricercare attivamente modi per ottimizzare le prestazioni. E se potessimo invertire questa situazione e fornire un sistema che fosse **veloce a prescindere**, rendendo le ottimizzazioni qualcosa da cui tirarsi fuori?

La nostra risposta a queste domande sono i Signals. È un sistema che è "veloce a prescindere" senza richiedere l'utilizzo di memoizzazione o trucchetti e stratagemmi nella tua app. I Signal forniscono i benefici degli aggiornamenti granulari dello state a prescindere che lo state sia globale, passato come prop, in un componente o nello state locale di un componente.

## Segnali verso il futuro

L 'idea principale dietro ai Signals è che invece di passare un valore attraverso l'albero dei componenti, passiamo un oggetto signal contentente il valore (in modo simile a come funzioni un `ref`). Quando il valore di questo oggetto viene modificato, il signal rimanga lo stesso oggetto, risultando nella possibilità di poter aggiornarlo senza che i componenti attraverso cui questo venga passato debbano essere aggiornati, dal momento che i componenti vedono il signal e non il suo valore. Questo ci permette di saltare il re-rendering dei componenti intermedi e di saltare al rendering dei soli componenti che effettivamente utilizzino il suo valore.

![I Signals eludono l'algoritmo di diffing del Virtual DOM, a prescindere dal punto dell'albero dei componenti in cui si acceda al loro valore.](/signals/signals-update.png)

Stiamo sfruttando il fatto che il grafico dello state di un'applicazione è generalmente molto meno profondo del suo albero dei componenti. Il che ci porta a rendering più rapidi perché aggiornare il grafico dello state di un'applicazione richiede molto meno lavoro che aggiornare il suo albero dei componenti. Questa differenza è particolarmente evidente quando misarata nel browser - lo screenshot mostra il profiler del DevTools tracciare la stessa app misurata due volte: una che utilizzi gli hooks come "primitivi di stato" ed una che utilizza i signals:

![Mostra una comparazione del tracciamento degli aggiornamenti del Virtual DOM e degli aggiornamenti attraverso i Signals, che saltano praticamente tutti i "diffing" del Virtual DOM.](/signals/virtual-dom-vs-signals-update.png)

La versione con i Signal è decisamente più rapida di un qualsiasi meccanismo di update di qualsiasi framework basato sul Virtual DOM tradizionale. In alcune app testate, i Signals erano così veloci da essere difficile identificarli nei grafici.

I Signals ribaltano il paradigma della performance: invece di doversi impegnare per migliorare le performance tramite memoizzazione o altri stratagemmi, con i Signals ci si deve impegnare per peggiorarle, (non utilizzandoli).

Per raggiungere questo livello di performance, i Signals sono stati costruiti seguendo questi principi cardine:

* **Lazy di default:** Solo i Signals che vengono effettivamente utilizzati da qualche componente vengono osservati e aggiornati - i Signals disconnessi non incidono sulla performance.
* **Aggiornamenti ottimali:** Se il valore di un Signal non è cambiato, i componenti e gli "effetti" che lo usano non vengono aggiornati, persino se le dipendenze del Signal stesso siano state aggiornate.
* **Tracciamento ottimale delle dipendenze:** È il framework a gestire le dipendenze del Signal per te, basta agli array di dipendenze come con gli hooks.
* **Accesso diretto:** L'accesso al valore di un Signal ti registra automaticamente come osservatore di quel Signal, senza la necessità di hooks o selettori.

Questi principi fanno sì che i Signal siano adatti ad un ampio spettro di casid'uso, persino scenari che non prevedano il rendering di interfacce grafiche.


## Portare i signals in Preact

Avendo identificato il "primitivo di state" corretto, abbiamo dovuto inserirlo in Preact. La cosa che abbiamo sempre amato degli hooks è la possibilità di utilizzarli direttamente all'interno del componente.
Questo è un vantaggio ergonomico se comparato alle soluzioni per la gestione dello state di terze parti, che normalmente si basano sull'utilizzo di funzioni "selettore" o sul wrapping di un componente all'interno di una funzione che lo "abboni" agli aggiornamenti dello state.

```js
// Abbonamento basato sui Selettori :(
function Counter() {
  const value = useSelector(state => state.count);
  // ...
}
 
// Abbonamento basato sulle funzioni Wrapper :(
const counterState = new Counter();
 
const Counter = observe(props => {
  const value = counterState.count;
  // ...
});
```

Nessuno dei due approcci ci è sembrato soddisfacente. L'approccio del "selettore" richiede che tutti i punti di accesso allo state vengano wrappati, il che diventa tedioso per state complessi o indentati. L'approccio del "wrapper" richiede del lavoro manuale, che porta con sè la possibilità di errori come la dimenticanza di alcuni nomi o proprietà statiche.

Abbiamo avuto l'opportunità di lavorare a stretto contatto con tanti sviluppatori nel corso degli anni. Uno dei punti dolenti in comune, soprattutto per coloro che affrontavano per la prima volta (p)react, è che concetti come selettori e wrappers fossero paradigmi addizionali che devono essere appresi prima di sentirsi produttivi con qualsiasi soluzione di gestione dello state.

Idealmente, non vorremmo aver bisogno di conoscere selettori o wrapper, ma semplicemente poter avere accesso diretto allo state.

```jsx
// Immagina se questo fosse uno state globale e l'intera app avesse la necessità di accedervi:
let count = 0;
 
function Counter() {
 return (
   <button onClick={() => count++}>
     value: {count}
   </button>
 );
}
```
Il codice è chiaro ed è semplice capire cosa stia succedendo, ma sfortunatamente non funziona. Il componente non si aggiorna quando si clicca perché non vi è modo di sapere che `count` sia cambiato.

Però non riuscivamo a toglierci questo scenario dalla testa. Cosa avremmo potuto fare per rendere questo modello realtà? Abbiamo iniziato a prototipare alcune idee e implementazioni utilizzando i [pluggable renderer](/guide/v10/options) di Preact. Ci è voluto tempo, ma siamo finalmente riusciti a realizzarlo.

```jsx
// --repl
import { render } from "preact";
import { signal } from "@preact/signals";
// --repl-before
// Immagina se questo fosse uno state globale e l'intera app avesse la necessità di accedervi:
const count = signal(0);
 
function Counter() {
 return (
   <button onClick={() => count.value++}>
     Value: {count.value}
   </button>
 );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Non ci sono selettori o funzioni wrapper, niente. Accedere al valore del Signal è abbastanza perché il componente sappia che deve aggiornarsi quando il valore del signal cambi. Dopo aver provato i prototipi in alcune app, era chiaro che fosse la soluzione giusta. Scrivere codice in questo modo ci è subito risultato intuitivo e non richiedeva alcuna "ginnastica mentale" per continuare a far funzionare le app in modo ottimale.

## Possiamo renderli ancora più veloci?

Avremmo potuto fermarci quì e rilasciare i Signals così com'erano, ma questo è il team di Preact: Era fondamentale per noi vedere quanto in là avremmo potuto spingere l'integrazione di Preact. Nell'esempio del contatore precedente, il valore di `count` è utilizzato solo per la visualizzazione del testo, che non dovrebbe richiedere il re-rendering dell' intero componente. Invece di renderizzare automaticamente tutto il componente quando il valore del Signal cambi, cosa succederebbe se renderizzassimo solamento il testo? Ancora meglio, che succederebbe se bypassassimo in toto il Virtual DOM e aggiornassimo direttamente il DOM?

```jsx
const count = signal(0);
 
// Invece di questo:
<p>Value: {count.value}</p>
 
// … possiamo utilizzare l'intero Signal nel JSX:
<p>Value: {count}</p>
 
// … o addirittura passarli come attributi del DOM:
<input value={count} onInput={...} />
```

Quindi, sì, abbiamo fatto anche quello.

Puoi passare un signal direttamente nel JSX in un posto qualsiasi in cui normalmente useresti una stringa, il suo valore verrà renderizzato come semplice testo e si aggiornerà automaticamente ogni qual volta il suo valore cambi.

Questo funziona anche per le props.


## Prossimi passi

Se non vedi l'ora di provarli, puoi andare direttamente sulla nostra [documentazione](/guide/v10/signals) per i Signals, ci piacerebbe molto sapere come li userai.

Ricorda, non c'è alcuna fretta nel passari ai Signals. Gli Hooks continueranno ad essere supportati e funzionano molto bene anche in congiunzione con i Signals!
Raccomandiamo un passaggio graduale ai Signals provandoli su pochi componenti alla volta, per abituarti ai nuovi concetti.
