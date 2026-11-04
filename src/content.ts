// All page copy lives here so it can be replaced without touching layout.
export type Locale = 'en' | 'es'
export type Quest = { text: string; category: string; body: string }
export type TotemId = 'fox' | 'owl' | 'boar' | 'heron' | 'hare' | 'stag' | 'dog' | 'cat'
type Legal = { title: string; updated: string; sections: { heading: string; body: string }[] }

export type Content = {
  meta: { title: string; description: string }
  brand: { name: string; cta: string; tagline: string; switchLabel: string; chapter: string; back: string }
  hero: { title: string[] }
  quests: Quest[]
  problem: { label: string; title: string[]; body: string }
  clock: { label: string; title: string[]; left: string; right: string; accept: string }
  outcomes: { label: string; title: string[]; intro: string; items: { title: string; body: string; photo: string; alt: string }[] }
  voice: { label: string; title: string[]; left: string; right: string; prompt: string; hint: string }
  totems: { label: string; title: string[]; body: string; items: { id: TotemId; name: string; role: string; line: string }[] }
  stats: { label: string; title: string[]; body: string; items: { name: string; value: number }[] }
  guilds: { label: string; title: string[]; body: string; items: string[] }
  footer: { label: string; title: string; body: string; note: string; motto: string; privacy: string; terms: string }
  waitlist: { emailLabel: string; submit: string; invalid: string; notOpen: string }
  legal: { terms: Legal; privacy: Legal }
}

export const content: Record<Locale, Content> = {
  en: {
    meta: {
      title: 'Mito: small quests, out in the world',
      description: 'One small quest a day, done away from the screen.',
    },
    brand: {
      name: 'MITO',
      cta: 'Join Waitlist',
      tagline: 'One small quest a day, done away from the screen. Four stats that only grow out there.',
      switchLabel: 'Ver en español',
      chapter: 'Chapter',
      back: 'Back to Mito',
    },
    hero: { title: ['LEAVE', 'THE LOOP'] },
    quests: [
      { text: 'Ride a bus line to its last stop and walk back part of the way.', category: 'Uncharted', body: 'You live on a map you have barely read. Start at the edge of it.' },
      { text: 'Learn the name of someone you see every week.', category: 'Social', body: 'The person at the counter has been there for years. Ask.' },
      { text: 'Write a letter by hand and put it in a mailbox today.', category: 'Craft', body: 'Slow on purpose. Someone will keep this one in a drawer.' },
      { text: 'Cook a dish you cannot pronounce for someone else.', category: 'Craft', body: 'It may go badly. That is most of the story you get to tell.' },
      { text: 'Watch the sun come up from somewhere new.', category: 'Uncharted', body: 'Set the alarm once. The city looks different before it wakes.' },
      { text: 'Fix one broken thing you have been stepping around.', category: 'Craft', body: 'The drawer, the hinge, the light. It will take less time than the avoiding did.' },
      { text: 'Ask an older relative for a story you have not heard.', category: 'Social', body: 'Pick a year and ask what they were doing. Then just listen.' },
      { text: 'Spend an hour in a library section you would never choose.', category: 'Uncharted', body: 'Pull down whatever looks least like you and read a chapter.' },
    ],
    problem: {
      label: 'The Loop',
      title: ['YOUR DAYS HAVE', 'STARTED TO LOOK', 'LIKE REPOSTS', 'OF EACH OTHER.'],
      body: 'Wake, scroll, work, scroll, sleep. It is not a bad life, just one you could sum up in a single line. Nothing is wrong, and that is exactly what makes it so easy to stay.',
    },
    clock: {
      label: 'The Clock',
      title: ['YOU SAID YES.', 'NOW IT COUNTS DOWN.'],
      left: 'Every quest gets forty-eight hours from the moment you accept it. That leaves room for a busy week, and no room for a maybe.',
      right: 'Run out of time and the quest simply goes. No penalty, no broken streak to mourn. Tomorrow there is another one.',
      accept: 'Accepted',
    },
    outcomes: {
      label: 'Side Effects',
      title: ['IT RARELY GOES', 'AS PLANNED.'],
      intro: 'You set out to do one small thing. Here is what people bring back instead.',
      items: [
        { title: 'A stranger saves you a seat.', body: 'You only asked for directions. Now someone’s aunt is feeding you.', photo: '/photos/table.jpg', alt: 'A busy restaurant front on a city street at night' },
        { title: 'The quiet gets loud.', body: 'An hour into the walk, you stop composing what you would post about it.', photo: '/photos/walk.jpg', alt: 'A person seen from behind, walking at dusk' },
        { title: 'Your city rearranges itself.', body: 'Same neighborhood, new map. There was a bakery here all along.', photo: '/photos/door.jpg', alt: 'An old wooden door in a stone wall' },
        { title: 'You get good at something useless.', body: 'Nobody needs you to fix a bike chain by the road. You can now.', photo: '/photos/bicycle.jpg', alt: 'A purple bicycle leaning against an ivy wall' },
        { title: 'Your friends start tagging along.', body: 'Next week there are three of you, and nobody has checked the time.', photo: '/photos/friends.jpg', alt: 'Three friends laughing beside train tracks' },
      ],
    },
    voice: {
      label: 'Voice Notes',
      title: ['SAY HOW', 'IT WENT.'],
      left: 'Typing tidies things up. Talking does not. When you finish a quest, hold the button and tell it straight, while your shoes are still muddy.',
      right: 'Your note stays with the quest. The next person to draw it can listen first, then add their own to the pile.',
      prompt: 'HOW DID IT GO?',
      hint: 'Hold to record',
    },
    totems: {
      label: 'Totems',
      title: ['EIGHT TOTEMS.', 'PICK ONE.'],
      body: 'Your totem is the creature that walks this with you. It grows as you do, so choose the one that points where you are headed.',
      items: [
        { id: 'fox', name: 'Fox', role: 'the Scout', line: 'Knows three ways out of every room and two ways into most.' },
        { id: 'owl', name: 'Owl', role: 'the Scholar', line: 'Up all night with a question nobody asked. Delighted about it.' },
        { id: 'boar', name: 'Boar', role: 'the Vanguard', line: 'Goes first, goes straight, and repairs the fence later.' },
        { id: 'heron', name: 'Heron', role: 'the Monk', line: 'Can stand still longer than your problem can.' },
        { id: 'hare', name: 'Hare', role: 'the Trickster', line: 'Already left. Took your hat. You will laugh about it eventually.' },
        { id: 'stag', name: 'Stag', role: 'the Warden', line: 'Walks the whole forest every morning, in case it needs him.' },
        { id: 'dog', name: 'Dog', role: 'the Knight', line: 'A beagle in armor, sworn to you, easily distracted by smells.' },
        { id: 'cat', name: 'Cat', role: 'the Archer', line: 'Has never missed. Has also never admitted to trying.' },
      ],
    },
    stats: {
      label: 'Stats',
      title: ['IT ALL COUNTS', 'FOR SOMETHING.'],
      body: 'Each finished quest feeds one of four stats. Aim at the one you want to build, and let the rest catch you off guard. Nobody else sees the numbers. They are only there to show you how far you have come.',
      items: [
        { name: 'Strength', value: 31 },
        { name: 'Intellect', value: 18 },
        { name: 'Charisma', value: 26 },
        { name: 'Wisdom', value: 22 },
      ],
    },
    guilds: {
      label: 'Guilds',
      title: ['FIND YOUR PEOPLE.', 'OR GATHER THEM.'],
      body: 'A guild is a community built around one interest, and it is where your daily quests come from. Join a few, or start one for your street.',
      items: ['The Early Risers', 'The Long Way Home', 'The Open Table', 'The Slow Hands', 'The Far Shore'],
    },
    footer: {
      label: 'Get Going',
      title: 'Go do something.',
      body: 'Mito is still being built. This page is a design study, so the form below does not collect anything yet.',
      note: 'Nothing you type here leaves this page.',
      motto: 'Real life, no signal',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    waitlist: {
      emailLabel: 'Your email',
      submit: 'Join',
      invalid: 'That email does not look right.',
      notOpen: 'The list is not open yet. Nothing was sent or saved.',
    },
    legal: {
      terms: {
        title: 'TERMS',
        updated: 'Placeholder text for a design study. Not legal advice.',
        sections: [
          { heading: 'What this is', body: 'This website is a design study for an app called Mito. The app does not exist yet, so nothing here is an offer of a product or service.' },
          { heading: 'The waitlist', body: 'The waitlist form is a visual placeholder. It does not sign you up for anything.' },
          { heading: 'The quests', body: 'Quests on this page are examples. If you try one, use your own judgment and stay safe.' },
          { heading: 'Changes', body: 'These terms will be replaced with real ones before Mito launches.' },
        ],
      },
      privacy: {
        title: 'PRIVACY',
        updated: 'Placeholder text for a design study. Not legal advice.',
        sections: [
          { heading: 'What we collect', body: 'Nothing. This site has no accounts, no analytics and no tracking cookies.' },
          { heading: 'The waitlist form', body: 'What you type stays in your browser. It is not sent to us or to anyone else, and it is gone when you leave the page.' },
          { heading: 'Hosting', body: 'Like any website, the hosting provider may process basic technical request data, such as IP addresses, in order to serve these pages.' },
          { heading: 'Changes', body: 'This page will be rewritten if Mito ever starts collecting data.' },
        ],
      },
    },
  },
  es: {
    meta: {
      title: 'Mito: pequeñas misiones, allá afuera',
      description: 'Una pequeña misión al día, lejos de la pantalla.',
    },
    brand: {
      name: 'MITO',
      cta: 'Unirme a la lista',
      tagline: 'Una pequeña misión al día, lejos de la pantalla. Cuatro atributos que solo crecen allá afuera.',
      switchLabel: 'View in English',
      chapter: 'Capítulo',
      back: 'Volver a Mito',
    },
    hero: { title: ['SAL', 'DEL BUCLE'] },
    quests: [
      { text: 'Toma un autobús hasta la última parada y vuelve caminando un tramo.', category: 'Inexplorado', body: 'Vives en un mapa que apenas has leído. Empieza por el borde.' },
      { text: 'Aprende el nombre de alguien a quien ves cada semana.', category: 'Social', body: 'Esa persona lleva años detrás del mostrador. Pregúntale.' },
      { text: 'Escribe una carta a mano y échala hoy al buzón.', category: 'Oficio', body: 'Lento a propósito. Alguien la guardará en un cajón.' },
      { text: 'Cocina para otra persona un plato que no sabes pronunciar.', category: 'Oficio', body: 'Puede salir mal. Eso es casi toda la historia que vas a contar.' },
      { text: 'Mira salir el sol desde un lugar nuevo.', category: 'Inexplorado', body: 'Pon la alarma una vez. La ciudad se ve distinta antes de despertar.' },
      { text: 'Arregla algo roto que llevas tiempo esquivando.', category: 'Oficio', body: 'El cajón, la bisagra, la luz. Te tomará menos que seguir evitándolo.' },
      { text: 'Pídele a un familiar mayor una historia que no conozcas.', category: 'Social', body: 'Elige un año y pregúntale qué hacía entonces. Luego solo escucha.' },
      { text: 'Pasa una hora en una sección de la biblioteca que nunca elegirías.', category: 'Inexplorado', body: 'Saca lo que menos se parezca a ti y lee un capítulo.' },
    ],
    problem: {
      label: 'El bucle',
      title: ['TUS DÍAS YA', 'PARECEN', 'REPUBLICACIONES', 'UNOS DE OTROS.'],
      body: 'Despertar, deslizar, trabajar, deslizar, dormir. No es una mala vida, solo una que cabe en una sola línea. Nada anda mal, y justo por eso es tan fácil quedarse.',
    },
    clock: {
      label: 'El reloj',
      title: ['DIJISTE QUE SÍ.', 'AHORA CORRE EL TIEMPO.'],
      left: 'Cada misión tiene cuarenta y ocho horas desde el momento en que la aceptas. Hay espacio para una semana ocupada, pero no para un quizás.',
      right: 'Si se acaba el tiempo, la misión simplemente se va. Sin castigo y sin racha rota que lamentar. Mañana habrá otra.',
      accept: 'Aceptada',
    },
    outcomes: {
      label: 'Efectos secundarios',
      title: ['CASI NUNCA SALE', 'COMO LO PLANEASTE.'],
      intro: 'Sales a hacer una cosa pequeña. Esto es lo que la gente trae de vuelta.',
      items: [
        { title: 'Alguien te guarda un asiento.', body: 'Solo preguntaste una dirección. Ahora la tía de alguien te está dando de comer.', photo: '/photos/table.jpg', alt: 'La fachada de un restaurante lleno en una calle de noche' },
        { title: 'El silencio se vuelve ruidoso.', body: 'A una hora de caminata, dejas de redactar lo que publicarías sobre ella.', photo: '/photos/walk.jpg', alt: 'Una persona de espaldas caminando al anochecer' },
        { title: 'Tu ciudad se reordena.', body: 'El mismo barrio, un mapa nuevo. Aquí siempre hubo una panadería.', photo: '/photos/door.jpg', alt: 'Una vieja puerta de madera en un muro de piedra' },
        { title: 'Aprendes algo inútil.', body: 'Nadie necesita que arregles una cadena de bici en la calle. Ahora sabes hacerlo.', photo: '/photos/bicycle.jpg', alt: 'Una bicicleta morada apoyada en un muro con hiedra' },
        { title: 'Tus amigos empiezan a venir.', body: 'La semana siguiente ya son tres, y nadie ha mirado la hora.', photo: '/photos/friends.jpg', alt: 'Tres amigas riendo junto a unas vías de tren' },
      ],
    },
    voice: {
      label: 'Notas de voz',
      title: ['CUENTA CÓMO', 'TE FUE.'],
      left: 'Al escribir, todo queda ordenado. Al hablar, no. Cuando termines una misión, mantén pulsado el botón y cuéntalo tal cual, con los zapatos todavía llenos de barro.',
      right: 'Tu nota se queda con la misión. Quien la reciba después puede escucharla primero y luego sumar la suya.',
      prompt: '¿CÓMO TE FUE?',
      hint: 'Mantén pulsado para grabar',
    },
    totems: {
      label: 'Tótems',
      title: ['OCHO TÓTEMS.', 'ELIGE UNO.'],
      body: 'Tu tótem es la criatura que recorre esto contigo. Crece a la par que tú, así que elige el que apunte hacia donde vas.',
      items: [
        { id: 'fox', name: 'Zorro', role: 'el Explorador', line: 'Conoce tres salidas de cada cuarto y dos entradas a casi todos.' },
        { id: 'owl', name: 'Búho', role: 'el Erudito', line: 'Despierto toda la noche con una pregunta que nadie hizo. Encantado.' },
        { id: 'boar', name: 'Jabalí', role: 'el Vanguardia', line: 'Va primero, va recto y repara la cerca después.' },
        { id: 'heron', name: 'Garza', role: 'la Monja', line: 'Puede quedarse quieta más tiempo que tu problema.' },
        { id: 'hare', name: 'Liebre', role: 'la Embaucadora', line: 'Ya se fue. Se llevó tu sombrero. Algún día te dará risa.' },
        { id: 'stag', name: 'Ciervo', role: 'el Guardián', line: 'Recorre todo el bosque cada mañana, por si lo necesita.' },
        { id: 'dog', name: 'Perro', role: 'el Caballero', line: 'Un beagle con armadura, leal a ti y fácil de distraer con un olor.' },
        { id: 'cat', name: 'Gato', role: 'el Arquero', line: 'Nunca ha fallado. Tampoco ha admitido nunca que lo intentaba.' },
      ],
    },
    stats: {
      label: 'Atributos',
      title: ['TODO CUENTA', 'PARA ALGO.'],
      body: 'Cada misión terminada alimenta uno de cuatro atributos. Apunta al que quieras desarrollar y deja que los demás te sorprendan. Nadie más ve los números. Solo están ahí para mostrarte cuánto has avanzado.',
      items: [
        { name: 'Fuerza', value: 31 },
        { name: 'Intelecto', value: 18 },
        { name: 'Carisma', value: 26 },
        { name: 'Sabiduría', value: 22 },
      ],
    },
    guilds: {
      label: 'Gremios',
      title: ['ENCUENTRA A TU GENTE.', 'O REÚNELA.'],
      body: 'Un gremio es una comunidad creada en torno a un interés, y de ahí salen tus misiones diarias. Únete a varios, o crea uno para tu calle.',
      items: ['Los Madrugadores', 'El Camino Largo', 'La Mesa Abierta', 'Las Manos Lentas', 'La Orilla Lejana'],
    },
    footer: {
      label: 'En marcha',
      title: 'Sal a hacer algo.',
      body: 'Mito todavía está en construcción. Esta página es un estudio de diseño, así que el formulario de abajo aún no recoge nada.',
      note: 'Nada de lo que escribas aquí sale de esta página.',
      motto: 'Vida real, sin señal',
      privacy: 'Privacidad',
      terms: 'Términos',
    },
    waitlist: {
      emailLabel: 'Tu correo',
      submit: 'Unirme',
      invalid: 'Ese correo no parece correcto.',
      notOpen: 'La lista aún no está abierta. No se envió ni se guardó nada.',
    },
    legal: {
      terms: {
        title: 'TÉRMINOS',
        updated: 'Texto provisional de un estudio de diseño. No es asesoría legal.',
        sections: [
          { heading: 'Qué es esto', body: 'Este sitio es un estudio de diseño para una aplicación llamada Mito. La aplicación aún no existe, así que nada de lo que aparece aquí es una oferta de producto o servicio.' },
          { heading: 'La lista de espera', body: 'El formulario de la lista de espera es un elemento visual provisional. No te inscribe en nada.' },
          { heading: 'Las misiones', body: 'Las misiones de esta página son ejemplos. Si pruebas alguna, usa tu propio criterio y cuídate.' },
          { heading: 'Cambios', body: 'Estos términos se sustituirán por unos reales antes del lanzamiento de Mito.' },
        ],
      },
      privacy: {
        title: 'PRIVACIDAD',
        updated: 'Texto provisional de un estudio de diseño. No es asesoría legal.',
        sections: [
          { heading: 'Qué recogemos', body: 'Nada. Este sitio no tiene cuentas, analítica ni cookies de seguimiento.' },
          { heading: 'El formulario de la lista', body: 'Lo que escribes se queda en tu navegador. No se nos envía a nosotros ni a nadie más, y desaparece al salir de la página.' },
          { heading: 'Alojamiento', body: 'Como en cualquier sitio web, el proveedor de alojamiento puede tratar datos técnicos básicos de las solicitudes, como direcciones IP, para servir estas páginas.' },
          { heading: 'Cambios', body: 'Esta página se reescribirá si Mito empieza a recoger datos.' },
        ],
      },
    },
  },
}
