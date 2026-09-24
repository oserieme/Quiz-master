import { Category, Difficulty, Question } from '../types/quiz';

export const CATEGORIES: Category[] = [
  'General Knowledge',
  'Science',
  'History',
  'Geography',
  'Technology',
  'Sports'
];

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const QUESTION_POOL: Question[] = [
  // ==========================================
  // GENERAL KNOWLEDGE - EASY (10 questions)
  // ==========================================
  {
    id: 'gk-e-1',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'How many days are there in a standard leap year?',
    options: ['364 days', '365 days', '366 days', '367 days'],
    correctAnswerIndex: 2,
    explanation: 'A leap year occurs once every four years and contains 366 days, with an extra day added to February.'
  },
  {
    id: 'gk-e-2',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'Which primary colors are mixed together to create green in traditional paint mixing?',
    options: ['Red and Blue', 'Blue and Yellow', 'Yellow and Red', 'Blue and Purple'],
    correctAnswerIndex: 1,
    explanation: 'In subtractive color mixing, combining the primary colors blue and yellow produces green.'
  },
  {
    id: 'gk-e-3',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'How many sides does a regular octagon have?',
    options: ['6 sides', '7 sides', '8 sides', '10 sides'],
    correctAnswerIndex: 2,
    explanation: 'An octagon is an eight-sided polygon, famously seen in stop signs around the world.'
  },
  {
    id: 'gk-e-4',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'What is the official national currency used in Japan?',
    options: ['Yuan', 'Won', 'Yen', 'Baht'],
    correctAnswerIndex: 2,
    explanation: 'The Japanese Yen (¥) has been the official currency of Japan since 1871.'
  },
  {
    id: 'gk-e-5',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'Which instrument has 88 keys in a standard modern acoustic configuration?',
    options: ['Harpsichord', 'Organ', 'Piano', 'Synthesizer'],
    correctAnswerIndex: 2,
    explanation: 'A standard full-size modern acoustic piano features 88 keys: 52 white and 36 black.'
  },
  {
    id: 'gk-e-6',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'Who painted the world-famous Mona Lisa portrait hanging in the Louvre?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Vincent van Gogh', 'Pablo Picasso'],
    correctAnswerIndex: 1,
    explanation: 'Leonardo da Vinci painted the Mona Lisa in the early 16th century during the Italian Renaissance.'
  },
  {
    id: 'gk-e-7',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'Which mammal is known as the only mammal capable of true sustained flight?',
    options: ['Flying Squirrel', 'Sugar Glider', 'Bat', 'Colugo'],
    correctAnswerIndex: 2,
    explanation: 'Bats are the only mammals with modified wings that achieve true powered and sustained flight.'
  },
  {
    id: 'gk-e-8',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'What sweet substance do honeybees produce from flower nectar?',
    options: ['Wax', 'Honey', 'Molasses', 'Maple Syrup'],
    correctAnswerIndex: 1,
    explanation: 'Bees collect sugary nectar from blossom flowers and convert it into honey through enzymatic activity.'
  },
  {
    id: 'gk-e-9',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'Which zodiac sign is represented by a pair of scales?',
    options: ['Taurus', 'Gemini', 'Libra', 'Sagittarius'],
    correctAnswerIndex: 2,
    explanation: 'Libra is symbolized by the scales of justice and balance in classical astrology.'
  },
  {
    id: 'gk-e-10',
    category: 'General Knowledge',
    difficulty: 'Easy',
    question: 'How many items are in a standard "baker\'s dozen"?',
    options: ['11', '12', '13', '14'],
    correctAnswerIndex: 2,
    explanation: 'A baker\'s dozen equals 13, historically provided by bakers to avoid severe penalties for selling underweight bread.'
  },

  // ==========================================
  // GENERAL KNOWLEDGE - MEDIUM (10 questions)
  // ==========================================
  {
    id: 'gk-m-1',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'Which classic Herman Melville novel famously opens with the line: "Call me Ishmael"?',
    options: ['The Old Man and the Sea', 'Moby-Dick', 'Billy Budd', 'Heart of Darkness'],
    correctAnswerIndex: 1,
    explanation: 'Moby-Dick (1851) by Herman Melville begins with this iconic literary opening.'
  },
  {
    id: 'gk-m-2',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'What does a gemstone "carat" specifically measure?',
    options: ['Hardness', 'Weight', 'Refractive Index', 'Color Purity'],
    correctAnswerIndex: 1,
    explanation: 'In gemstones, one carat is a standard unit of weight equal to exactly 200 milligrams (0.2 grams).'
  },
  {
    id: 'gk-m-3',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'Which prominent Greek philosopher was the personal tutor of young Alexander the Great?',
    options: ['Socrates', 'Plato', 'Aristotle', 'Zeno of Citium'],
    correctAnswerIndex: 2,
    explanation: 'King Philip II of Macedon engaged Aristotle in 343 BCE to instruct his thirteen-year-old son Alexander.'
  },
  {
    id: 'gk-m-4',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'What is the highest civilian award bestowed by the United States government?',
    options: ['Congressional Gold Medal', 'Presidential Medal of Freedom', 'Distinguished Service Cross', 'National Humanities Medal'],
    correctAnswerIndex: 1,
    explanation: 'Established by President John F. Kennedy, the Presidential Medal of Freedom is the nation\'s premier civilian decoration.'
  },
  {
    id: 'gk-m-5',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'What type of animal is a "mandrill"?',
    options: ['A predatory bird', 'An Old World monkey', 'A venomous serpent', 'A marsupial badger'],
    correctAnswerIndex: 1,
    explanation: 'The mandrill is an Old World monkey belonging to the family Cercopithecidae, native to equatorial Africa.'
  },
  {
    id: 'gk-m-6',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'Which mythological creature has the head of a human and the body of a winged lion?',
    options: ['Chimera', 'Sphinx', 'Griffin', 'Manticore'],
    correctAnswerIndex: 1,
    explanation: 'The Sphinx has a human head, lion\'s body, and in Greek mythology, falcon or eagle wings.'
  },
  {
    id: 'gk-m-7',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'Which author created the legendary fictional detective Hercule Poirot?',
    options: ['Arthur Conan Doyle', 'Agatha Christie', 'Dorothy L. Sayers', 'Edgar Allan Poe'],
    correctAnswerIndex: 1,
    explanation: 'Dame Agatha Christie introduced the meticulous Belgian detective Hercule Poirot in 1920.'
  },
  {
    id: 'gk-m-8',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'What is the national flower of Scotland?',
    options: ['Rose', 'Thistle', 'Shamrock', 'Daffodil'],
    correctAnswerIndex: 1,
    explanation: 'The prickly purple thistle has stood as Scotland\'s heraldic floral emblem for centuries.'
  },
  {
    id: 'gk-m-9',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'Which constellation features the famous three-star formation known as the "Belt"?',
    options: ['Ursa Major', 'Cassiopeia', 'Orion', 'Pegasus'],
    correctAnswerIndex: 2,
    explanation: 'Orion\'s Belt consists of three bright stars: Alnitak, Alnilam, and Mintaka.'
  },
  {
    id: 'gk-m-10',
    category: 'General Knowledge',
    difficulty: 'Medium',
    question: 'In standard international maritime signal flags, what does the "Blue Peter" flag indicate?',
    options: ['Vessel is sinking', 'Vessel is preparing to sail', 'Quarantine in effect', 'Medical doctor on board'],
    correctAnswerIndex: 1,
    explanation: 'Hoisting the Blue Peter flag (Papa) in harbor signifies that all personnel must return because the ship is ready to sail.'
  },

  // ==========================================
  // GENERAL KNOWLEDGE - HARD (10 questions)
  // ==========================================
  {
    id: 'gk-h-1',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'What is the title of the world\'s oldest preserved continuous epic poem, originating in ancient Mesopotamia?',
    options: ['Enuma Elish', 'The Epic of Gilgamesh', 'The Song of Roland', 'The Mahabharata'],
    correctAnswerIndex: 1,
    explanation: 'The Epic of Gilgamesh dates back to Third Dynasty of Ur c. 2100 BCE, recorded on clay cuneiform tablets.'
  },
  {
    id: 'gk-h-2',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'Which architect designed the Guggenheim Museum in Bilbao, Spain, renowned for its titanium curves?',
    options: ['Frank Gehry', 'Zaha Hadid', 'Renzo Piano', 'I.M. Pei'],
    correctAnswerIndex: 0,
    explanation: 'Canadian-American architect Frank Gehry designed the deconstructivist titanium masterpiece opened in 1997.'
  },
  {
    id: 'gk-h-3',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'What term denotes the fear of long words, famously written as a humorous self-referential term?',
    options: ['Nomophobia', 'Hippopotomonstrosesquippedaliophobia', 'Bibliophobia', 'Chronophobia'],
    correctAnswerIndex: 1,
    explanation: 'Hippopotomonstrosesquippedaliophobia (or sesquipedalophobia) is humorously used to describe the fear of polysyllabic words.'
  },
  {
    id: 'gk-h-4',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'Which 17th-century Dutch painter created the monumental militia portrait "The Night Watch"?',
    options: ['Johannes Vermeer', 'Rembrandt van Rijn', 'Frans Hals', 'Jan Steen'],
    correctAnswerIndex: 1,
    explanation: 'Rembrandt completed "Militia Company of District II under Captain Frans Banninck Cocq" (The Night Watch) in 1642.'
  },
  {
    id: 'gk-h-5',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'What is the oldest continuously operating university in the world, founded in Fes, Morocco in 859 CE?',
    options: ['University of Bologna', 'University of Al-Qarawiyyin', 'Al-Azhar University', 'University of Oxford'],
    correctAnswerIndex: 1,
    explanation: 'University of Al-Qarawiyyin was founded by Fatima al-Fihri in 859 CE and is recognized by UNESCO as the oldest operational higher institution.'
  },
  {
    id: 'gk-h-6',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'Which rare chemical element was named after the ancient Greek word for "unstable" due to its lack of stable isotopes?',
    options: ['Technetium', 'Astatine', 'Promethium', 'Francium'],
    correctAnswerIndex: 1,
    explanation: 'Astatine comes from Greek "astatos", meaning unstable; it is the rarest naturally occurring halogen in the Earth\'s crust.'
  },
  {
    id: 'gk-h-7',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'Who composed the avant-garde 1952 composition "4\'33\"", which instructs performers not to play their instruments for its duration?',
    options: ['Philip Glass', 'John Cage', 'Karlheinz Stockhausen', 'Steve Reich'],
    correctAnswerIndex: 1,
    explanation: 'John Cage composed 4\'33" to frame ambient environmental sounds as musical art.'
  },
  {
    id: 'gk-h-8',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'Which precious natural spice is harvested by hand exclusively from the dried stigmas of Crocus sativus?',
    options: ['Cardamom', 'Vanilla', 'Saffron', 'Nutmeg'],
    correctAnswerIndex: 2,
    explanation: 'Saffron is the world\'s costliest spice by weight, requiring around 75,000 crocus flowers to produce one pound of dried threads.'
  },
  {
    id: 'gk-h-9',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'In standard heraldry, what tincture color does the term "Vert" denote?',
    options: ['Red', 'Blue', 'Green', 'Black'],
    correctAnswerIndex: 2,
    explanation: 'In heraldic terminology, Vert represents green, Gules is red, Azure is blue, and Sable is black.'
  },
  {
    id: 'gk-h-10',
    category: 'General Knowledge',
    difficulty: 'Hard',
    question: 'What is the proper taxonomic term for an animal that feeds exclusively on snails and slugs?',
    options: ['Xylophage', 'Malacophage', 'Piscivore', 'Ophiophage'],
    correctAnswerIndex: 1,
    explanation: 'A malacophage or malacovore is a specialized carnivore whose primary diet consists of mollusks like snails.'
  },

  // ==========================================
  // SCIENCE - EASY (10 questions)
  // ==========================================
  {
    id: 'sci-e-1',
    category: 'Science',
    difficulty: 'Easy',
    question: 'What is the chemical formula for water?',
    options: ['CO2', 'H2O', 'NaCl', 'O2'],
    correctAnswerIndex: 1,
    explanation: 'Water is formed of two hydrogen atoms bonded to one oxygen atom (H2O).'
  },
  {
    id: 'sci-e-2',
    category: 'Science',
    difficulty: 'Easy',
    question: 'Which planet is closest to the Sun in our solar system?',
    options: ['Venus', 'Mercury', 'Mars', 'Earth'],
    correctAnswerIndex: 1,
    explanation: 'Mercury orbits nearest to the Sun at an average distance of about 57.9 million kilometers.'
  },
  {
    id: 'sci-e-3',
    category: 'Science',
    difficulty: 'Easy',
    question: 'What gas do humans inhale that is vital for cellular respiration?',
    options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Helium'],
    correctAnswerIndex: 2,
    explanation: 'Oxygen (O2) is transported through blood to cells to generate ATP through aerobic cellular respiration.'
  },
  {
    id: 'sci-e-4',
    category: 'Science',
    difficulty: 'Easy',
    question: 'What part of a plant primarily absorbs water and nutrients from the soil?',
    options: ['Leaves', 'Flowers', 'Roots', 'Stem'],
    correctAnswerIndex: 2,
    explanation: 'Plant roots anchor the plant and absorb moisture and essential mineral ions from the ground.'
  },
  {
    id: 'sci-e-5',
    category: 'Science',
    difficulty: 'Easy',
    question: 'What is the boiling point of pure water at sea level under standard atmospheric pressure?',
    options: ['90°C (194°F)', '100°C (212°F)', '110°C (230°F)', '120°C (248°F)'],
    correctAnswerIndex: 1,
    explanation: 'At standard atmospheric pressure of 1 atm, pure water boils at 100 degrees Celsius (212°F).'
  },
  {
    id: 'sci-e-6',
    category: 'Science',
    difficulty: 'Easy',
    question: 'Which force causes an apple to fall from a tree branch toward the ground?',
    options: ['Magnetism', 'Friction', 'Gravity', 'Electrostatics'],
    correctAnswerIndex: 2,
    explanation: 'Earth\'s gravitational attraction pulls masses downward toward the center of the planet.'
  },
  {
    id: 'sci-e-7',
    category: 'Science',
    difficulty: 'Easy',
    question: 'What is the natural satellite that orbits planet Earth?',
    options: ['Titan', 'Europa', 'The Moon', 'Phobos'],
    correctAnswerIndex: 2,
    explanation: 'The Moon is Earth\'s only permanent natural satellite, orbiting at an average distance of ~384,400 km.'
  },
  {
    id: 'sci-e-8',
    category: 'Science',
    difficulty: 'Easy',
    question: 'Which organ in the human body pumps blood through the circulatory system?',
    options: ['Lungs', 'Heart', 'Kidneys', 'Liver'],
    correctAnswerIndex: 1,
    explanation: 'The human heart is a muscular organ that pumps deoxygenated blood to lungs and oxygenated blood to the body.'
  },
  {
    id: 'sci-e-9',
    category: 'Science',
    difficulty: 'Easy',
    question: 'What process do plants use to convert sunlight into sugars?',
    options: ['Fermentation', 'Photosynthesis', 'Oxidation', 'Digestion'],
    correctAnswerIndex: 1,
    explanation: 'Photosynthesis uses chlorophyll to turn water, sunlight, and carbon dioxide into glucose and oxygen.'
  },
  {
    id: 'sci-e-10',
    category: 'Science',
    difficulty: 'Easy',
    question: 'Which state of matter has a fixed volume but takes the shape of its container?',
    options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
    correctAnswerIndex: 1,
    explanation: 'Liquids have a definite volume but conform readily to the geometry of their container.'
  },

  // ==========================================
  // SCIENCE - MEDIUM (10 questions)
  // ==========================================
  {
    id: 'sci-m-1',
    category: 'Science',
    difficulty: 'Medium',
    question: 'What is the most abundant gas in Earth\'s atmosphere by volume?',
    options: ['Oxygen', 'Nitrogen', 'Argon', 'Carbon Dioxide'],
    correctAnswerIndex: 1,
    explanation: 'Nitrogen gas (N2) comprises approximately 78% of Earth\'s atmosphere, followed by oxygen at 21%.'
  },
  {
    id: 'sci-m-2',
    category: 'Science',
    difficulty: 'Medium',
    question: 'What is the powerhouse organelle of eukaryotic cells responsible for producing ATP?',
    options: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Endoplasmic reticulum'],
    correctAnswerIndex: 1,
    explanation: 'Mitochondria generate the cellular currency ATP through the citric acid cycle and oxidative phosphorylation.'
  },
  {
    id: 'sci-m-3',
    category: 'Science',
    difficulty: 'Medium',
    question: 'What is the hardest naturally occurring mineral on the Mohs hardness scale?',
    options: ['Corundum', 'Topaz', 'Quartz', 'Diamond'],
    correctAnswerIndex: 3,
    explanation: 'Diamond is pure crystallized tetrahedral carbon and ranks at 10 on the Mohs scale.'
  },
  {
    id: 'sci-m-4',
    category: 'Science',
    difficulty: 'Medium',
    question: 'Approximately how long does light from the Sun take to reach Earth?',
    options: ['8 seconds', '8 minutes and 20 seconds', '1 hour', '24 hours'],
    correctAnswerIndex: 1,
    explanation: 'Traveling 300,000 km/s over 149.6 million km, sunlight takes about 500 seconds (8 min 20 sec) to reach Earth.'
  },
  {
    id: 'sci-m-5',
    category: 'Science',
    difficulty: 'Medium',
    question: 'Which subatomic particle in an atomic nucleus carries zero net electrical charge?',
    options: ['Proton', 'Electron', 'Neutron', 'Positron'],
    correctAnswerIndex: 2,
    explanation: 'Neutrons have neutral charge and reside in the nucleus alongside positively charged protons.'
  },
  {
    id: 'sci-m-6',
    category: 'Science',
    difficulty: 'Medium',
    question: 'Which planet in our solar system has the hottest average surface temperature due to runaway greenhouse effect?',
    options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
    correctAnswerIndex: 1,
    explanation: 'Venus has an intense CO2 atmosphere creating average temperatures exceeding 460°C (860°F).'
  },
  {
    id: 'sci-m-7',
    category: 'Science',
    difficulty: 'Medium',
    question: 'What human blood type is considered the universal red blood cell donor in emergency medicine?',
    options: ['AB Positive', 'O Negative', 'A Positive', 'O Positive'],
    correctAnswerIndex: 1,
    explanation: 'O-negative red blood cells lack A, B, and Rh antigens, making them generally safe for transfusion in emergencies.'
  },
  {
    id: 'sci-m-8',
    category: 'Science',
    difficulty: 'Medium',
    question: 'What chemical element has the symbol "Fe" on the periodic table?',
    options: ['Fluorine', 'Iron', 'Francium', 'Lead'],
    correctAnswerIndex: 1,
    explanation: 'Iron is symbolized Fe from its classical Latin name "Ferrum".'
  },
  {
    id: 'sci-m-9',
    category: 'Science',
    difficulty: 'Medium',
    question: 'What scale is used in seismology to quantify the total energy released by an earthquake?',
    options: ['Beaufort scale', 'Moment magnitude scale', 'Fujita scale', 'Mohs scale'],
    correctAnswerIndex: 1,
    explanation: 'The Moment Magnitude scale (Mw) is modern seismology\'s standard for calculating seismic energy release.'
  },
  {
    id: 'sci-m-10',
    category: 'Science',
    difficulty: 'Medium',
    question: 'What is the chemical name for ordinary table salt?',
    options: ['Potassium chloride', 'Sodium chloride', 'Calcium carbonate', 'Sodium bicarbonate'],
    correctAnswerIndex: 1,
    explanation: 'Table salt consists of the ionic crystal compound sodium chloride (NaCl).'
  },

  // ==========================================
  // SCIENCE - HARD (10 questions)
  // ==========================================
  {
    id: 'sci-h-1',
    category: 'Science',
    difficulty: 'Hard',
    question: 'Which fundamental particle is believed to grant other elementary particles their mass via field interaction?',
    options: ['Gluon', 'Higgs Boson', 'Graviton', 'Z Boson'],
    correctAnswerIndex: 1,
    explanation: 'The Higgs boson, confirmed at CERN\'s LHC in 2012, is the quantum excitation of the mass-giving Higgs field.'
  },
  {
    id: 'sci-h-2',
    category: 'Science',
    difficulty: 'Hard',
    question: 'What is the value of absolute zero temperature on the Celsius scale?',
    options: ['-273.15°C', '-459.67°C', '-100°C', '-373.15°C'],
    correctAnswerIndex: 0,
    explanation: 'Absolute zero (0 Kelvin) corresponds precisely to -273.15 degrees on the Celsius scale.'
  },
  {
    id: 'sci-h-3',
    category: 'Science',
    difficulty: 'Hard',
    question: 'Which quantum mechanical principle asserts that position and momentum cannot be simultaneously measured with arbitrary precision?',
    options: ['Pauli Exclusion Principle', 'Heisenberg Uncertainty Principle', 'Schrödinger Wave Equation', 'De Broglie Hypothesis'],
    correctAnswerIndex: 1,
    explanation: 'Werner Heisenberg formulated the uncertainty principle in 1927: Δx · Δp ≥ ℏ/2.'
  },
  {
    id: 'sci-h-4',
    category: 'Science',
    difficulty: 'Hard',
    question: 'In genetics, what term describes the three-nucleotide sequence on mRNA that codes for a specific amino acid?',
    options: ['Intron', 'Anticodon', 'Codon', 'Exon'],
    correctAnswerIndex: 2,
    explanation: 'A codon consists of three RNA nucleotides (e.g., AUG for methionine) specifying an amino acid or stop signal.'
  },
  {
    id: 'sci-h-5',
    category: 'Science',
    difficulty: 'Hard',
    question: 'What is the boundary around a black hole beyond which nothing, not even light, can escape called?',
    options: ['Photon sphere', 'Ergosphere', 'Event horizon', 'Singularity point'],
    correctAnswerIndex: 2,
    explanation: 'The event horizon is the threshold at which escape velocity equals the speed of light.'
  },
  {
    id: 'sci-h-6',
    category: 'Science',
    difficulty: 'Hard',
    question: 'Which metal is liquid at standard room temperature and pressure (20°C)?',
    options: ['Gallium', 'Mercury', 'Cesium', 'Bromine'],
    correctAnswerIndex: 1,
    explanation: 'Mercury (element 80, Hg) has a melting point of -38.83°C, remaining liquid at room temperature (Bromine is a nonmetal).'
  },
  {
    id: 'sci-h-7',
    category: 'Science',
    difficulty: 'Hard',
    question: 'What enzyme unwinds and unzips the double-stranded DNA helix during DNA replication?',
    options: ['DNA Polymerase', 'DNA Ligase', 'DNA Helicase', 'RNA Primase'],
    correctAnswerIndex: 2,
    explanation: 'DNA helicase breaks hydrogen bonds holding nucleotide base pairs together, opening the replication fork.'
  },
  {
    id: 'sci-h-8',
    category: 'Science',
    difficulty: 'Hard',
    question: 'What is the SI unit of electric capacitance named in honor of an English physicist?',
    options: ['Henry', 'Tesla', 'Farad', 'Weber'],
    correctAnswerIndex: 2,
    explanation: 'The farad (symbol F) is the SI derived unit of electrical capacitance, named after Michael Faraday.'
  },
  {
    id: 'sci-h-9',
    category: 'Science',
    difficulty: 'Hard',
    question: 'Which geological eon covers roughly the first 4 billion years of Earth history prior to the Phanerozoic?',
    options: ['Mesozoic', 'Precambrian Supereon', 'Cenozoic', 'Paleozoic'],
    correctAnswerIndex: 1,
    explanation: 'The Precambrian supereon spans from Earth\'s formation ~4.6 Ga to the Cambrian explosion ~541 Ma.'
  },
  {
    id: 'sci-h-10',
    category: 'Science',
    difficulty: 'Hard',
    question: 'What is the name of the astronomical effect where light frequency shifts toward longer wavelengths due to cosmological expansion?',
    options: ['Blueshift', 'Cosmological Redshift', 'Compton scattering', 'Cherenkov radiation'],
    correctAnswerIndex: 1,
    explanation: 'As light travels through expanding space, its wavelength is stretched toward the red end of the spectrum.'
  },

  // ==========================================
  // HISTORY - EASY (10 questions)
  // ==========================================
  {
    id: 'hist-e-1',
    category: 'History',
    difficulty: 'Easy',
    question: 'In which year did the Apollo 11 lunar mission land humans on the Moon for the first time?',
    options: ['1961', '1965', '1969', '1972'],
    correctAnswerIndex: 2,
    explanation: 'On July 20, 1969, Neil Armstrong and Buzz Aldrin landed the Apollo 11 lunar module Eagle on the Moon.'
  },
  {
    id: 'hist-e-2',
    category: 'History',
    difficulty: 'Easy',
    question: 'Who was the first President of the United States under the Constitution?',
    options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
    correctAnswerIndex: 2,
    explanation: 'George Washington served as the first U.S. President from 1789 to 1797.'
  },
  {
    id: 'hist-e-3',
    category: 'History',
    difficulty: 'Easy',
    question: 'The ancient pyramids of Giza are located in which modern country?',
    options: ['Greece', 'Egypt', 'Iraq', 'Mexico'],
    correctAnswerIndex: 1,
    explanation: 'The monumental Giza pyramid complex stands near Cairo on the west bank of the Nile in Egypt.'
  },
  {
    id: 'hist-e-4',
    category: 'History',
    difficulty: 'Easy',
    question: 'In which year did the historic Titanic passenger liner sink on its maiden voyage?',
    options: ['1905', '1912', '1920', '1925'],
    correctAnswerIndex: 1,
    explanation: 'RMS Titanic struck an iceberg in the North Atlantic and sank on April 15, 1912.'
  },
  {
    id: 'hist-e-5',
    category: 'History',
    difficulty: 'Easy',
    question: 'Who delivered the famous "I Have a Dream" civil rights speech in Washington D.C. in 1963?',
    options: ['Malcolm X', 'Martin Luther King Jr.', 'John Lewis', 'Thurgood Marshall'],
    correctAnswerIndex: 1,
    explanation: 'Dr. Martin Luther King Jr. delivered his historic address during the March on Washington on August 28, 1963.'
  },
  {
    id: 'hist-e-6',
    category: 'History',
    difficulty: 'Easy',
    question: 'Which legendary queen ruled ancient Egypt alongside Julius Caesar and Mark Antony?',
    options: ['Nefertiti', 'Hatshepsut', 'Cleopatra VII', 'Sobekneferu'],
    correctAnswerIndex: 2,
    explanation: 'Cleopatra VII Philopator was the last active ruler of the Ptolemaic Kingdom of Egypt.'
  },
  {
    id: 'hist-e-7',
    category: 'History',
    difficulty: 'Easy',
    question: 'In which year did the Berlin Wall fall, opening the border between East and West Germany?',
    options: ['1979', '1984', '1989', '1995'],
    correctAnswerIndex: 2,
    explanation: 'On November 9, 1989, East Germany opened the Berlin Wall, leading to German reunification in 1990.'
  },
  {
    id: 'hist-e-8',
    category: 'History',
    difficulty: 'Easy',
    question: 'Which ancient Mediterranean empire had its capital in Rome and conquered much of Europe?',
    options: ['Persian Empire', 'Roman Empire', 'Ottoman Empire', 'Mongol Empire'],
    correctAnswerIndex: 1,
    explanation: 'The Roman Empire dominated the Mediterranean basin for centuries, leaving lasting legal and cultural legacies.'
  },
  {
    id: 'hist-e-9',
    category: 'History',
    difficulty: 'Easy',
    question: 'Who was the British Prime Minister during most of the Second World War?',
    options: ['Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Harold Macmillan'],
    correctAnswerIndex: 1,
    explanation: 'Winston Churchill led the UK from 1940 to 1945, famously rallying the nation with wartime broadcasts.'
  },
  {
    id: 'hist-e-10',
    category: 'History',
    difficulty: 'Easy',
    question: 'Which document declared the thirteen American colonies free from British rule in 1776?',
    options: ['The Bill of Rights', 'The Articles of Confederation', 'The Declaration of Independence', 'The U.S. Constitution'],
    correctAnswerIndex: 2,
    explanation: 'The Declaration of Independence was ratified on July 4, 1776 by the Second Continental Congress.'
  },

  // ==========================================
  // HISTORY - MEDIUM (10 questions)
  // ==========================================
  {
    id: 'hist-m-1',
    category: 'History',
    difficulty: 'Medium',
    question: 'The Magna Carta was sealed at Runnymede in 1215 by which English monarch?',
    options: ['King John', 'King Richard the Lionheart', 'King Henry II', 'King Edward I'],
    correctAnswerIndex: 0,
    explanation: 'King John was compelled by rebellious feudal barons to grant the Magna Carta on June 15, 1215.'
  },
  {
    id: 'hist-m-2',
    category: 'History',
    difficulty: 'Medium',
    question: 'Who was the first Emperor of a unified China, known for commissioning the Terracotta Army?',
    options: ['Qin Shi Huang', 'Kublai Khan', 'Han Wudi', 'Emperor Taizong'],
    correctAnswerIndex: 0,
    explanation: 'Qin Shi Huang unified the warring states of China in 221 BCE, founding the Qin Dynasty.'
  },
  {
    id: 'hist-m-3',
    category: 'History',
    difficulty: 'Medium',
    question: 'Which ancient trade network linked China and East Asia with the Mediterranean for centuries?',
    options: ['The Amber Road', 'The Silk Road', 'The Incense Route', 'The Trans-Saharan Route'],
    correctAnswerIndex: 1,
    explanation: 'The Silk Road was an expansive overland network conveying silk, spices, porcelain, and philosophies.'
  },
  {
    id: 'hist-m-4',
    category: 'History',
    difficulty: 'Medium',
    question: 'The Rosetta Stone, found in 1799, allowed modern historians to decipher which script?',
    options: ['Cuneiform', 'Egyptian Hieroglyphs', 'Linear A', 'Ogham'],
    correctAnswerIndex: 1,
    explanation: 'Featuring the same royal decree in Hieroglyphic, Demotic, and Ancient Greek, it unlocked ancient Egyptian texts.'
  },
  {
    id: 'hist-m-5',
    category: 'History',
    difficulty: 'Medium',
    question: 'Which prominent merchant family dominated Florence\'s politics and sponsored Renaissance artists?',
    options: ['Sforza family', 'Borgia family', 'Medici family', 'Visconti family'],
    correctAnswerIndex: 2,
    explanation: 'The Medici banking family patronized Michelangelo, Brunelleschi, and Botticelli, funding the Italian Renaissance.'
  },
  {
    id: 'hist-m-6',
    category: 'History',
    difficulty: 'Medium',
    question: 'Which European naval fleet was sent in 1588 by Philip II of Spain to invade England but ended in defeat?',
    options: ['Spanish Armada', 'Battle of Lepanto fleet', 'Grand Fleet', 'Hanseatic League'],
    correctAnswerIndex: 0,
    explanation: 'The Spanish Armada was outmaneuvered by English ships under Sir Francis Drake and battered by storms.'
  },
  {
    id: 'hist-m-7',
    category: 'History',
    difficulty: 'Medium',
    question: 'Which pre-Columbian civilization built the citadel of Machu Picchu high in the Andes mountains?',
    options: ['Aztec Empire', 'Maya Civilization', 'Inca Empire', 'Toltec Empire'],
    correctAnswerIndex: 2,
    explanation: 'The Inca Empire constructed Machu Picchu in the 15th century under Emperor Pachacuti.'
  },
  {
    id: 'hist-m-8',
    category: 'History',
    difficulty: 'Medium',
    question: 'In which year did the French Revolution officially begin with the Storming of the Bastille?',
    options: ['1776', '1789', '1799', '1804'],
    correctAnswerIndex: 1,
    explanation: 'Parisian citizens stormed the Bastille fortress on July 14, 1789, marking the dawn of the French Revolution.'
  },
  {
    id: 'hist-m-9',
    category: 'History',
    difficulty: 'Medium',
    question: 'Which South African anti-apartheid leader spent 27 years in prison before becoming president in 1994?',
    options: ['Desmond Tutu', 'Nelson Mandela', 'Steve Biko', 'Walter Sisulu'],
    correctAnswerIndex: 1,
    explanation: 'Nelson Mandela was released in 1990 and elected President of South Africa in the first multiracial elections in 1994.'
  },
  {
    id: 'hist-m-10',
    category: 'History',
    difficulty: 'Medium',
    question: 'Which war ended with the signing of the Treaty of Versailles in the Hall of Mirrors in 1919?',
    options: ['Franco-Prussian War', 'World War I', 'World War II', 'Crimean War'],
    correctAnswerIndex: 1,
    explanation: 'The Treaty of Versailles formally concluded World War I between Germany and the Allied Powers.'
  },

  // ==========================================
  // HISTORY - HARD (10 questions)
  // ==========================================
  {
    id: 'hist-h-1',
    category: 'History',
    difficulty: 'Hard',
    question: 'In which decisive battle in 31 BCE did Octavian defeat the combined forces of Mark Antony and Cleopatra?',
    options: ['Battle of Pharsalus', 'Battle of Actium', 'Battle of Philippi', 'Battle of Cannae'],
    correctAnswerIndex: 1,
    explanation: 'The naval Battle of Actium off the coast of Greece enabled Octavian to become Augustus, the first Roman emperor.'
  },
  {
    id: 'hist-h-2',
    category: 'History',
    difficulty: 'Hard',
    question: 'Which Byzantine Emperor codified Roman law into the landmark "Corpus Juris Civilis" in the 6th century?',
    options: ['Constantine the Great', 'Justinian I', 'Heraclius', 'Basil II'],
    correctAnswerIndex: 1,
    explanation: 'Justinian I commissioned legal scholars led by Tribonian to compile and reform Roman legal codes (529–534 CE).'
  },
  {
    id: 'hist-h-3',
    category: 'History',
    difficulty: 'Hard',
    question: 'What peace treaties signed in 1648 brought an end to the devastating Thirty Years\' War in Europe?',
    options: ['Peace of Utrecht', 'Peace of Westphalia', 'Treaty of Tordesillas', 'Treaty of Aix-la-Chapelle'],
    correctAnswerIndex: 1,
    explanation: 'The Peace of Westphalia established modern state sovereignty and diplomatic recognition between nations.'
  },
  {
    id: 'hist-h-4',
    category: 'History',
    difficulty: 'Hard',
    question: 'Who founded the Achaemenid Persian Empire by conquering the Median, Lydian, and Babylonian empires?',
    options: ['Darius the Great', 'Xerxes I', 'Cyrus the Great', 'Cambyses II'],
    correctAnswerIndex: 2,
    explanation: 'Cyrus the Great (Cyrus II) founded the largest empire the ancient world had yet seen, reigning 559–530 BCE.'
  },
  {
    id: 'hist-h-5',
    category: 'History',
    difficulty: 'Hard',
    question: 'Which female pharaoh of Egypt\'s 18th Dynasty established extensive trade expeditions to the Land of Punt?',
    options: ['Twosret', 'Hatshepsut', 'Neferneferuaten', 'Merneith'],
    correctAnswerIndex: 1,
    explanation: 'Hatshepsut ruled as pharaoh for over two decades, famously building the mortuary temple at Deir el-Bahari.'
  },
  {
    id: 'hist-h-6',
    category: 'History',
    difficulty: 'Hard',
    question: 'What military defeat in 1815 permanently ended Napoleon Bonaparte\'s reign as French Emperor?',
    options: ['Battle of Leipzig', 'Battle of Austerlitz', 'Battle of Waterloo', 'Battle of Borodino'],
    correctAnswerIndex: 2,
    explanation: 'The Duke of Wellington and Field Marshal von Blücher defeated Napoleon at Waterloo in present-day Belgium on June 18, 1815.'
  },
  {
    id: 'hist-h-7',
    category: 'History',
    difficulty: 'Hard',
    question: 'Which medieval Mongol leader took the title "Genghis Khan" and unified the nomadic tribes of the steppe in 1206?',
    options: ['Temüjin', 'Ögedei', 'Subutai', 'Jochi'],
    correctAnswerIndex: 0,
    explanation: 'Born Temüjin Borjigin, he was proclaimed Genghis Khan ("Universal Ruler") at a kurultai council in 1206.'
  },
  {
    id: 'hist-h-8',
    category: 'History',
    difficulty: 'Hard',
    question: 'The Meiji Restoration of 1868 returned practical imperial rule and initiated rapid modernization in which country?',
    options: ['Korea', 'China', 'Japan', 'Thailand'],
    correctAnswerIndex: 2,
    explanation: 'The Meiji Restoration abolished the Tokugawa shogunate, transforming Japan into an industrialized modern power.'
  },
  {
    id: 'hist-h-9',
    category: 'History',
    difficulty: 'Hard',
    question: 'What was the code name for the 1944 Allied amphibious invasion of Normandy during World War II?',
    options: ['Operation Barbarossa', 'Operation Overlord', 'Operation Market Garden', 'Operation Torch'],
    correctAnswerIndex: 1,
    explanation: 'Operation Overlord commenced on D-Day (June 6, 1944) with amphibious landings along the Normandy coastline.'
  },
  {
    id: 'hist-h-10',
    category: 'History',
    difficulty: 'Hard',
    question: 'Which Scottish inventor patented the separate steam condenser in 1769, driving the Industrial Revolution forward?',
    options: ['James Watt', 'Richard Arkwright', 'George Stephenson', 'Thomas Newcomen'],
    correctAnswerIndex: 0,
    explanation: 'James Watt\'s condenser drastically increased fuel efficiency compared to Thomas Newcomen\'s earlier atmospheric engine.'
  },

  // ==========================================
  // GEOGRAPHY - EASY (10 questions)
  // ==========================================
  {
    id: 'geo-e-1',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'What is the largest ocean on planet Earth by surface area?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    correctAnswerIndex: 2,
    explanation: 'The Pacific Ocean covers over 165 million square kilometers, more than all Earth\'s land area combined.'
  },
  {
    id: 'geo-e-2',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'What is the capital city of France?',
    options: ['Rome', 'Madrid', 'Paris', 'Berlin'],
    correctAnswerIndex: 2,
    explanation: 'Paris has been the capital city of France for over a thousand years.'
  },
  {
    id: 'geo-e-3',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'Which continent is known as the coldest, windiest, and driest landmass on Earth?',
    options: ['Europe', 'Antarctica', 'South America', 'Australia'],
    correctAnswerIndex: 1,
    explanation: 'Antarctica is permanently covered in ice sheets and classified as a polar desert.'
  },
  {
    id: 'geo-e-4',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'What is the tallest mountain peak in the world above sea level?',
    options: ['K2', 'Mount Kilimanjaro', 'Mount Everest', 'Mont Blanc'],
    correctAnswerIndex: 2,
    explanation: 'Mount Everest reaches 8,848.86 meters (29,031.7 ft) on the border of Nepal and China.'
  },
  {
    id: 'geo-e-5',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'Which country is shaped like a boot in southern Europe?',
    options: ['Spain', 'Greece', 'Italy', 'Portugal'],
    correctAnswerIndex: 2,
    explanation: 'Italy\'s peninsula forms the iconic boot shape kicking the island of Sicily into the Mediterranean.'
  },
  {
    id: 'geo-e-6',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'Which massive rainforest produces an immense share of the world\'s freshwater and terrestrial oxygen?',
    options: ['Congo Basin', 'Amazon Rainforest', 'Daintree Rainforest', 'Taiga'],
    correctAnswerIndex: 1,
    explanation: 'The Amazon basin spans nine South American countries and is Earth\'s largest tropical rainforest.'
  },
  {
    id: 'geo-e-7',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'Which river flows through northeastern Africa and is traditionally considered the world\'s longest?',
    options: ['Amazon', 'Nile', 'Yangtze', 'Danube'],
    correctAnswerIndex: 1,
    explanation: 'The Nile River flows approximately 6,650 km northward through eleven African countries.'
  },
  {
    id: 'geo-e-8',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'What is the capital city of the United Kingdom?',
    options: ['Dublin', 'Edinburgh', 'London', 'Cardiff'],
    correctAnswerIndex: 2,
    explanation: 'London has been the political capital of England and the United Kingdom for centuries.'
  },
  {
    id: 'geo-e-9',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'Which is the largest country in the world by total land area?',
    options: ['Canada', 'United States', 'China', 'Russia'],
    correctAnswerIndex: 3,
    explanation: 'Russia spans over 17 million square kilometers across eleven time zones in Eastern Europe and Northern Asia.'
  },
  {
    id: 'geo-e-10',
    category: 'Geography',
    difficulty: 'Easy',
    question: 'On which continent is the Sahara Desert located?',
    options: ['Asia', 'Africa', 'South America', 'Australia'],
    correctAnswerIndex: 1,
    explanation: 'The Sahara Desert spans approximately 9.2 million square kilometers across northern Africa.'
  },

  // ==========================================
  // GEOGRAPHY - MEDIUM (10 questions)
  // ==========================================
  {
    id: 'geo-m-1',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'What is the official capital city of Australia?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    correctAnswerIndex: 2,
    explanation: 'Canberra was established as a planned compromise capital between rivals Sydney and Melbourne in 1913.'
  },
  {
    id: 'geo-m-2',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'Which narrow strait separates the European continent from North Africa?',
    options: ['Strait of Hormuz', 'Strait of Gibraltar', 'Bosphorus Strait', 'Bering Strait'],
    correctAnswerIndex: 1,
    explanation: 'The Strait of Gibraltar connects the Atlantic to the Mediterranean, only 13 km wide at its narrowest point.'
  },
  {
    id: 'geo-m-3',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'Which country has the greatest number of natural lakes in the world?',
    options: ['Russia', 'Canada', 'United States', 'Finland'],
    correctAnswerIndex: 1,
    explanation: 'Canada contains over 2 million lakes, holding more than half of all natural freshwater lakes on Earth.'
  },
  {
    id: 'geo-m-4',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'What is the smallest independent sovereign state in the world by land area and population?',
    options: ['Monaco', 'San Marino', 'Vatican City', 'Nauru'],
    correctAnswerIndex: 2,
    explanation: 'Vatican City covers an area of roughly 0.49 square kilometers (121 acres) in Rome.'
  },
  {
    id: 'geo-m-5',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'Which African nation is an enclave entirely surrounded by South Africa?',
    options: ['Swaziland (Eswatini)', 'Lesotho', 'Botswana', 'Namibia'],
    correctAnswerIndex: 1,
    explanation: 'The Kingdom of Lesotho is an independent country completely enclosed within the territory of South Africa.'
  },
  {
    id: 'geo-m-6',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'What is the highest uninterrupted waterfall on Earth, plunging 979 meters in Venezuela?',
    options: ['Iguazu Falls', 'Victoria Falls', 'Angel Falls', 'Niagara Falls'],
    correctAnswerIndex: 2,
    explanation: 'Angel Falls (Kerepakupai Merú) drops from the Auyán-tepui plateau in Canaima National Park.'
  },
  {
    id: 'geo-m-7',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'What is the deepest known point in Earth\'s seabed, located in the western Pacific Mariana Trench?',
    options: ['Java Trench', 'Challenger Deep', 'Puerto Rico Trench', 'Molley Deep'],
    correctAnswerIndex: 1,
    explanation: 'Challenger Deep plunges to a verified depth of approximately 10,928 meters (35,853 feet).'
  },
  {
    id: 'geo-m-8',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'Which European capital city is built across an archipelago of 14 islands connected by over 50 bridges?',
    options: ['Amsterdam', 'Stockholm', 'Venice', 'Copenhagen'],
    correctAnswerIndex: 1,
    explanation: 'Stockholm, Sweden is situated where Lake Mälaren flows into the Baltic Sea across 14 islands.'
  },
  {
    id: 'geo-m-9',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'Which sea has salinity so dense (around 34%) that bathers float without effort?',
    options: ['Red Sea', 'Dead Sea', 'Caspian Sea', 'Black Sea'],
    correctAnswerIndex: 1,
    explanation: 'The Dead Sea is a hypersaline terminal lake bordered by Jordan and Israel with nearly 10x ocean salinity.'
  },
  {
    id: 'geo-m-10',
    category: 'Geography',
    difficulty: 'Medium',
    question: 'What is the capital of Canada?',
    options: ['Toronto', 'Montreal', 'Ottawa', 'Vancouver'],
    correctAnswerIndex: 2,
    explanation: 'Queen Victoria chose Ottawa as Canada\'s capital in 1857 due to its strategic position between French and English populations.'
  },

  // ==========================================
  // GEOGRAPHY - HARD (10 questions)
  // ==========================================
  {
    id: 'geo-h-1',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'What is the capital city of Kazakhstan, which was renamed Nur-Sultan before reverting back in 2022?',
    options: ['Almaty', 'Astana', 'Shymkent', 'Aktobe'],
    correctAnswerIndex: 1,
    explanation: 'Astana replaced Almaty as capital in 1997, was renamed Nur-Sultan in 2019, and reverted to Astana in 2022.'
  },
  {
    id: 'geo-h-2',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'Which country in the world spans the greatest number of standard time zones across its mainland and overseas territories?',
    options: ['Russia', 'United States', 'France', 'United Kingdom'],
    correctAnswerIndex: 2,
    explanation: 'France spans 12 time zones (13 during daylight saving) due to its overseas territories across the globe.'
  },
  {
    id: 'geo-h-3',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'Which lake in southern Siberia is both the deepest (1,642 m) and oldest lake in the world?',
    options: ['Lake Victoria', 'Lake Baikal', 'Lake Superior', 'Lake Tanganyika'],
    correctAnswerIndex: 1,
    explanation: 'Lake Baikal holds roughly 20% of Earth\'s unfrozen surface freshwater and is 25 million years old.'
  },
  {
    id: 'geo-h-4',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'Which is the only continent in the world that has no active volcanic activity on land?',
    options: ['Australia', 'Antarctica', 'South America', 'Europe'],
    correctAnswerIndex: 0,
    explanation: 'Australia sits in the middle of a tectonic plate, making its mainland devoid of active volcanoes.'
  },
  {
    id: 'geo-h-5',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'What is the highest capital city in the world at an altitude of 3,640 meters (11,942 ft)?',
    options: ['Quito, Ecuador', 'La Paz, Bolivia', 'Bogotá, Colombia', 'Lhasa, Tibet'],
    correctAnswerIndex: 1,
    explanation: 'La Paz is the administrative capital of Bolivia, resting in an Andean canyon above 3,600 meters.'
  },
  {
    id: 'geo-h-6',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'Which island is the largest island on Earth that is not considered a continent?',
    options: ['New Guinea', 'Borneo', 'Greenland', 'Madagascar'],
    correctAnswerIndex: 2,
    explanation: 'Greenland covers an area of 2,166,086 km², recognized as the world\'s largest non-continental island.'
  },
  {
    id: 'geo-h-7',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'Which mountain pass in the Karakoram range stands near the highest international paved road (Karakoram Highway)?',
    options: ['Khyber Pass', 'Khunjerab Pass', 'Rohtang Pass', 'Nathu La'],
    correctAnswerIndex: 1,
    explanation: 'The Khunjerab Pass at 4,693 meters links Gilgit-Baltistan in Pakistan with Xinjiang, China.'
  },
  {
    id: 'geo-h-8',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'What is the name of the desert located in northern Chile that is considered the driest non-polar desert in the world?',
    options: ['Kalahari Desert', 'Atacama Desert', 'Sonoran Desert', 'Namib Desert'],
    correctAnswerIndex: 1,
    explanation: 'The Atacama Desert is blocked from precipitation by both the Andes and the Chilean Coast Range.'
  },
  {
    id: 'geo-h-9',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'Which archipelago nation in the Indian Ocean comprises 26 natural coral atolls made of over 1,190 islands?',
    options: ['Seychelles', 'Mauritius', 'Maldives', 'Comoros'],
    correctAnswerIndex: 2,
    explanation: 'The Republic of Maldives is Earth\'s lowest-lying nation, averaging just 1.5 meters above sea level.'
  },
  {
    id: 'geo-h-10',
    category: 'Geography',
    difficulty: 'Hard',
    question: 'Which body of water is bounded by the shores of Kazakhstan, Turkmenistan, Iran, Azerbaijan, and Russia?',
    options: ['Aral Sea', 'Black Sea', 'Caspian Sea', 'Red Sea'],
    correctAnswerIndex: 2,
    explanation: 'The Caspian Sea is the world\'s largest inland body of water, categorized as both a lake and a sea.'
  },

  // ==========================================
  // TECHNOLOGY - EASY (10 questions)
  // ==========================================
  {
    id: 'tech-e-1',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'What company developed the Windows operating system used on billions of PCs?',
    options: ['Apple', 'Microsoft', 'Google', 'IBM'],
    correctAnswerIndex: 1,
    explanation: 'Microsoft launched Windows in 1985 as a graphical operating system shell for MS-DOS.'
  },
  {
    id: 'tech-e-2',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'How many bits are in one standard digital byte?',
    options: ['4 bits', '8 bits', '16 bits', '32 bits'],
    correctAnswerIndex: 1,
    explanation: 'One standard byte is made up of 8 bits, which can represent 256 distinct numeric values.'
  },
  {
    id: 'tech-e-3',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'What does "PC" commonly stand for in computing?',
    options: ['Personal Computer', 'Private Circuit', 'Program Controller', 'Portable Core'],
    correctAnswerIndex: 0,
    explanation: 'PC stands for Personal Computer, popularized by the IBM PC 5150 introduced in 1981.'
  },
  {
    id: 'tech-e-4',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'Which mobile operating system is developed by Google and used on Samsung, Pixel, and Xiaomi phones?',
    options: ['iOS', 'Android', 'Windows Mobile', 'Symbian'],
    correctAnswerIndex: 1,
    explanation: 'Android is an open-source, Linux-based mobile operating system managed by Google.'
  },
  {
    id: 'tech-e-5',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'What does "WWW" stand for when addressing websites?',
    options: ['World Wide Web', 'World Wireless Wave', 'Wide Web Window', 'World Web Wire'],
    correctAnswerIndex: 0,
    explanation: 'The World Wide Web (WWW) was invented by Sir Tim Berners-Lee in 1989 at CERN.'
  },
  {
    id: 'tech-e-6',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'What does the acronym "RAM" represent in computer hardware?',
    options: ['Random Access Memory', 'Read And Modify', 'Rapid Action Microchip', 'Remote Access Module'],
    correctAnswerIndex: 0,
    explanation: 'Random Access Memory (RAM) provides fast, volatile read/write storage for executing programs.'
  },
  {
    id: 'tech-e-7',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'Which device is used to enter text, commands, and numbers into a desktop computer?',
    options: ['Monitor', 'Keyboard', 'Speaker', 'Webcam'],
    correctAnswerIndex: 1,
    explanation: 'Keyboards are the primary alphanumeric input peripheral derived from historic typewriters.'
  },
  {
    id: 'tech-e-8',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'Which popular video-sharing website was founded in 2005 and acquired by Google in 2006?',
    options: ['Vimeo', 'YouTube', 'Twitch', 'TikTok'],
    correctAnswerIndex: 1,
    explanation: 'YouTube was founded by Chad Hurley, Steve Chen, and Jawed Karim before being bought by Google.'
  },
  {
    id: 'tech-e-9',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'What wireless technology allows short-range communication between headphones and smartphones?',
    options: ['Bluetooth', 'NFC', 'Infrared', 'Wi-Fi 6'],
    correctAnswerIndex: 0,
    explanation: 'Bluetooth uses short-wavelength UHF radio waves in the 2.4 GHz ISM band for wireless personal networks.'
  },
  {
    id: 'tech-e-10',
    category: 'Technology',
    difficulty: 'Easy',
    question: 'What does "CPU" stand for in hardware specifications?',
    options: ['Central Processing Unit', 'Core Programming Utility', 'Compute Power Unit', 'Central Peripheral Unit'],
    correctAnswerIndex: 0,
    explanation: 'The Central Processing Unit (CPU) executes instructions comprising computer programs.'
  },

  // ==========================================
  // TECHNOLOGY - MEDIUM (10 questions)
  // ==========================================
  {
    id: 'tech-m-1',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'What does the acronym "HTTP" stand for in web network protocols?',
    options: ['High Transmission Text Protocol', 'Hypertext Transfer Protocol', 'Hybrid Text Technology Provider', 'Hyperlink Telecom Protocol'],
    correctAnswerIndex: 1,
    explanation: 'Hypertext Transfer Protocol (HTTP) is the foundational application protocol used across the World Wide Web.'
  },
  {
    id: 'tech-m-2',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'Who created the open-source Linux operating system kernel in 1991 as a university student?',
    options: ['Richard Stallman', 'Linus Torvalds', 'Ken Thompson', 'Dennis Ritchie'],
    correctAnswerIndex: 1,
    explanation: 'Linus Torvalds created Linux at the University of Helsinki and released it as open-source software.'
  },
  {
    id: 'tech-m-3',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'What does the abbreviation "GPU" stand for in computer graphics and AI compute?',
    options: ['General Processing Unit', 'Graphics Processing Unit', 'Grid Parallel Utility', 'Global Performance Unit'],
    correctAnswerIndex: 1,
    explanation: 'A Graphics Processing Unit (GPU) handles parallel computations for graphics, machine learning, and simulations.'
  },
  {
    id: 'tech-m-4',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'Which programming language was created by Brendan Eich in 10 days in 1995 for Netscape Navigator?',
    options: ['Python', 'JavaScript', 'Java', 'PHP'],
    correctAnswerIndex: 1,
    explanation: 'Brendan Eich designed JavaScript in May 1995 to enable interactive client-side web browser experiences.'
  },
  {
    id: 'tech-m-5',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'What is the primary role of a DNS server on the internet?',
    options: ['Encrypting web traffic', 'Translating domain names into IP addresses', 'Storing database backups', 'Routing fiber-optic cables'],
    correctAnswerIndex: 1,
    explanation: 'The Domain Name System (DNS) translates human-readable hostnames (e.g., google.com) into numerical IP addresses.'
  },
  {
    id: 'tech-m-6',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'What does "SSD" stand for in non-volatile storage hardware?',
    options: ['Solid State Drive', 'System Storage Device', 'Static Synchronous Disk', 'Serial Silicon Drive'],
    correctAnswerIndex: 0,
    explanation: 'Solid State Drives use NAND flash memory with no moving parts, delivering much faster speeds than magnetic hard disks.'
  },
  {
    id: 'tech-m-7',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'Who co-founded Microsoft with Bill Gates in 1975 in Albuquerque, New Mexico?',
    options: ['Paul Allen', 'Steve Ballmer', 'Steve Wozniak', 'Gordon Moore'],
    correctAnswerIndex: 0,
    explanation: 'Paul Allen co-founded Microsoft with Bill Gates to build BASIC programming software for the Altair 8800.'
  },
  {
    id: 'tech-m-8',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'What empirical observation predicted that the number of transistors on microchips doubles roughly every two years?',
    options: ['Metcalfe\'s Law', 'Moore\'s Law', 'Amdahl\'s Law', 'Brooks\'s Law'],
    correctAnswerIndex: 1,
    explanation: 'Intel co-founder Gordon Moore articulated Moore\'s Law in 1965, forecasting exponential semiconductor advances.'
  },
  {
    id: 'tech-m-9',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'Which company launched the original iPhone in January 2007, ushering in the modern smartphone era?',
    options: ['Nokia', 'Apple', 'BlackBerry', 'Motorola'],
    correctAnswerIndex: 1,
    explanation: 'Steve Jobs introduced the iPhone at Macworld on January 9, 2007, pioneering capacitive multi-touch smartphones.'
  },
  {
    id: 'tech-m-10',
    category: 'Technology',
    difficulty: 'Medium',
    question: 'In computer programming, what does the acronym "API" stand for?',
    options: ['Application Programming Interface', 'Automated Process Integration', 'Advanced Program Instruction', 'Algorithmic Protocol Index'],
    correctAnswerIndex: 0,
    explanation: 'An Application Programming Interface defines rules and mechanisms for software programs to interact with one another.'
  },

  // ==========================================
  // TECHNOLOGY - HARD (10 questions)
  // ==========================================
  {
    id: 'tech-h-1',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'Who is widely regarded as the world\'s first computer programmer for writing an algorithm for Babbage\'s Analytical Engine?',
    options: ['Grace Hopper', 'Ada Lovelace', 'Alan Turing', 'Margaret Hamilton'],
    correctAnswerIndex: 1,
    explanation: 'In 1843, Ada Lovelace translated Luigi Menabrea\'s paper and annotated an algorithm to calculate Bernoulli numbers.'
  },
  {
    id: 'tech-h-2',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'Which mathematical problem class in computational complexity theory consists of decision problems verifiable in polynomial time?',
    options: ['P', 'NP', 'PSPACE', 'EXPTIME'],
    correctAnswerIndex: 1,
    explanation: 'NP (Nondeterministic Polynomial time) denotes decision problems whose solutions can be verified in polynomial time.'
  },
  {
    id: 'tech-h-3',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'What is the default TCP port number standardly reserved for secure encrypted HTTPS web traffic?',
    options: ['Port 80', 'Port 443', 'Port 8080', 'Port 22'],
    correctAnswerIndex: 1,
    explanation: 'Port 80 is used for unencrypted HTTP, while Port 443 is universally assigned to HTTPS (HTTP over TLS/SSL).'
  },
  {
    id: 'tech-h-4',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'Which scientist and codebreaker devised the Bombe machine to crack Enigma and formulated modern computation theory?',
    options: ['Claude Shannon', 'John von Neumann', 'Alan Turing', 'Norbert Wiener'],
    correctAnswerIndex: 2,
    explanation: 'Alan Turing led cryptoanalytic breakthroughs at Bletchley Park and proved the Universal Turing Machine model.'
  },
  {
    id: 'tech-h-5',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'What consensus mechanism does Bitcoin natively use to secure its distributed ledger and validate blocks?',
    options: ['Proof of Stake', 'Proof of Work', 'Delegated Proof of Stake', 'Proof of Authority'],
    correctAnswerIndex: 1,
    explanation: 'Satoshi Nakamoto implemented Hashcash-based Proof of Work (SHA-256) to achieve Byzantine fault tolerance.'
  },
  {
    id: 'tech-h-6',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'In relational database management, what does the "ACID" acronym guarantee?',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Accuracy, Concurrency, Integrity, Distribution',
      'Asynchronous, Cached, Indexed, Distributed',
      'Automated, Compliant, Isolated, Decoupled'
    ],
    correctAnswerIndex: 0,
    explanation: 'ACID guarantees that database transactions are processed reliably even during crashes or power failures.'
  },
  {
    id: 'tech-h-7',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'Which bell labs researcher created the C programming language and co-developed the Unix operating system?',
    options: ['Bjarne Stroustrup', 'Dennis Ritchie', 'Brian Kernighan', 'Niklaus Wirth'],
    correctAnswerIndex: 1,
    explanation: 'Dennis Ritchie developed the C language between 1969 and 1973 and rewrote the Unix kernel in C.'
  },
  {
    id: 'tech-h-8',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'What is the quantum computing equivalent of a classical binary bit that can exist in superposed states?',
    options: ['Qubit', 'Quark', 'Boson bit', 'Wavelet'],
    correctAnswerIndex: 0,
    explanation: 'A qubit (quantum bit) leverages quantum superposition and entanglement to represent combinations of 0 and 1.'
  },
  {
    id: 'tech-h-9',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'Which network topology connects every computer node directly to a central hub, switch, or router?',
    options: ['Ring topology', 'Bus topology', 'Star topology', 'Mesh topology'],
    correctAnswerIndex: 2,
    explanation: 'In a star network topology, each network host is connected via point-to-point cable to a central network switch.'
  },
  {
    id: 'tech-h-10',
    category: 'Technology',
    difficulty: 'Hard',
    question: 'What deep learning transformer architecture was introduced in the seminal 2017 Google paper "Attention Is All You Need"?',
    options: ['Convolutional Neural Network', 'Recurrent Neural Network', 'Transformer', 'Boltzmann Machine'],
    correctAnswerIndex: 2,
    explanation: 'Vaswani et al. introduced the Self-Attention Transformer architecture, which powers modern LLMs and generative AI.'
  },

  // ==========================================
  // SPORTS - EASY (10 questions)
  // ==========================================
  {
    id: 'sport-e-1',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'How many players are on the field for one team during a regulation association football (soccer) match?',
    options: ['9 players', '10 players', '11 players', '12 players'],
    correctAnswerIndex: 2,
    explanation: 'A soccer team consists of 11 players on the pitch, including 1 designated goalkeeper.'
  },
  {
    id: 'sport-e-2',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'Which country has won the most FIFA Men\'s World Cup trophies in history?',
    options: ['Germany', 'Italy', 'Brazil', 'Argentina'],
    correctAnswerIndex: 2,
    explanation: 'Brazil holds the record with five FIFA World Cup championships (1958, 1962, 1970, 1994, 2002).'
  },
  {
    id: 'sport-e-3',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'In basketball, how many points is a successful basket worth from inside the perimeter three-point arc?',
    options: ['1 point', '2 points', '3 points', '4 points'],
    correctAnswerIndex: 1,
    explanation: 'Field goals made within the three-point arc count for 2 points, while free throws count for 1 point.'
  },
  {
    id: 'sport-e-4',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'In tennis, which Grand Slam tournament is famous for being played on natural grass courts in London?',
    options: ['US Open', 'Roland Garros', 'Wimbledon', 'Australian Open'],
    correctAnswerIndex: 2,
    explanation: 'The Championships at Wimbledon has been played on outdoor grass courts since 1877.'
  },
  {
    id: 'sport-e-5',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'How many strikes are needed to bowl a "perfect game" of 300 points in ten-pin bowling?',
    options: ['9 strikes', '10 strikes', '12 strikes', '15 strikes'],
    correctAnswerIndex: 2,
    explanation: 'Bowling 12 consecutive strikes across all 10 frames achieves the maximum 300-point perfect game.'
  },
  {
    id: 'sport-e-6',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'What color card is brandished by a soccer referee to order a player off the pitch for a severe infraction?',
    options: ['Yellow card', 'Green card', 'Red card', 'Blue card'],
    correctAnswerIndex: 2,
    explanation: 'A red card means immediate expulsion from the match, and the penalized team must play with one fewer player.'
  },
  {
    id: 'sport-e-7',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'Which sport uses stones, brooms, and "the house" target circles on an ice sheet?',
    options: ['Bobsleigh', 'Curling', 'Ice Hockey', 'Speed Skating'],
    correctAnswerIndex: 1,
    explanation: 'Curling players slide heavy polished granite stones across ice toward a circular target called the house.'
  },
  {
    id: 'sport-e-8',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'How many bases must a baseball batter touch in sequence to complete a full home run?',
    options: ['3 bases', '4 bases (including home plate)', '5 bases', '2 bases'],
    correctAnswerIndex: 1,
    explanation: 'A runner touches first, second, third base, and finally home plate to score a run.'
  },
  {
    id: 'sport-e-9',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'Which legendary Jamaican sprinter won eight Olympic gold medals and set world records in the 100m and 200m?',
    options: ['Tyson Gay', 'Asafa Powell', 'Usain Bolt', 'Carl Lewis'],
    correctAnswerIndex: 2,
    explanation: 'Usain Bolt set the unbroken 100m world record of 9.58 seconds at the 2009 World Championships in Berlin.'
  },
  {
    id: 'sport-e-10',
    category: 'Sports',
    difficulty: 'Easy',
    question: 'In American football, how many points are awarded for scoring a touchdown?',
    options: ['3 points', '6 points', '7 points', '2 points'],
    correctAnswerIndex: 1,
    explanation: 'A touchdown awards 6 points, with an opportunity for an extra point conversion kick (1 pt) or 2-point attempt.'
  },

  // ==========================================
  // SPORTS - MEDIUM (10 questions)
  // ==========================================
  {
    id: 'sport-m-1',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'What is the official standardized distance of an Olympic marathon footrace?',
    options: ['40.00 km', '42.195 km (26.2 miles)', '45.00 km', '38.50 km'],
    correctAnswerIndex: 1,
    explanation: 'The marathon distance was standardized at 42.195 kilometers (26 miles 385 yards) at the 1908 London Games.'
  },
  {
    id: 'sport-m-2',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'In golf, what term describes completing a hole in two strokes under the par rating?',
    options: ['Birdie', 'Eagle', 'Albatross', 'Bogey'],
    correctAnswerIndex: 1,
    explanation: 'One under par is a birdie, two under par is an eagle, and three under par is an albatross.'
  },
  {
    id: 'sport-m-3',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'Which city hosted the first modern Olympic Games in 1896?',
    options: ['Paris, France', 'London, UK', 'Athens, Greece', 'Rome, Italy'],
    correctAnswerIndex: 2,
    explanation: 'The first modern Olympiad was held at the Panathenaic Stadium in Athens in April 1896.'
  },
  {
    id: 'sport-m-4',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'How many regulation periods are played in a professional NHL ice hockey game, and how long is each?',
    options: ['4 periods of 15 minutes', '3 periods of 20 minutes', '2 periods of 30 minutes', '4 periods of 12 minutes'],
    correctAnswerIndex: 1,
    explanation: 'NHL matches consist of three regulation periods of 20 minutes each, totaling 60 minutes of regulation play.'
  },
  {
    id: 'sport-m-5',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'Which heavyweight boxing legend was famously proclaimed "The Greatest" and used the "rope-a-dope" technique?',
    options: ['George Foreman', 'Joe Frazier', 'Muhammad Ali', 'Mike Tyson'],
    correctAnswerIndex: 2,
    explanation: 'Muhammad Ali employed the rope-a-dope against George Foreman during the 1974 "Rumble in the Jungle".'
  },
  {
    id: 'sport-m-6',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'How many red balls are arranged in the triangular pack at the start of a snooker frame?',
    options: ['10 red balls', '12 red balls', '15 red balls', '21 red balls'],
    correctAnswerIndex: 2,
    explanation: 'Snooker begins with 15 red balls (1 point each), 6 colored balls (2-7 points), and 1 white cue ball.'
  },
  {
    id: 'sport-m-7',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'In swimming, which stroke is performed while floating on one\'s back throughout the race?',
    options: ['Breaststroke', 'Butterfly', 'Backstroke', 'Freestyle'],
    correctAnswerIndex: 2,
    explanation: 'Backstroke is the only regulated competitive swimming stroke swum entirely on the back.'
  },
  {
    id: 'sport-m-8',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'Which nation has won the most Olympic gold medals in men\'s field hockey history, including six consecutive golds from 1928 to 1956?',
    options: ['Pakistan', 'India', 'Netherlands', 'Australia'],
    correctAnswerIndex: 1,
    explanation: 'India has won eight Olympic gold medals in men\'s field hockey, an all-time tournament record.'
  },
  {
    id: 'sport-m-9',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'What is the maximum break score possible in standard snooker without referee foul awards?',
    options: ['147 points', '155 points', '180 points', '140 points'],
    correctAnswerIndex: 0,
    explanation: 'Potting 15 reds with 15 blacks (120 points) plus all six colors in order (27 points) yields a maximum break of 147.'
  },
  {
    id: 'sport-m-10',
    category: 'Sports',
    difficulty: 'Medium',
    question: 'In cycling, what is the French term for the dense main pack or cluster of riders in a road race?',
    options: ['Peloton', 'Grupetto', 'Echelon', 'Domestique'],
    correctAnswerIndex: 0,
    explanation: 'The peloton is the primary cluster of riders cycling together to reduce aerodynamic drag.'
  },

  // ==========================================
  // SPORTS - HARD (10 questions)
  // ==========================================
  {
    id: 'sport-h-1',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'Who is the only tennis player in history to achieve the Golden Slam (all four Grand Slams and Olympic Gold in a single calendar year)?',
    options: ['Serena Williams', 'Steffi Graf', 'Martina Navratilova', 'Roger Federer'],
    correctAnswerIndex: 1,
    explanation: 'Steffi Graf achieved this unprecedented feat in 1988 by winning Australian, French, Wimbledon, US Open, and Seoul Olympic gold.'
  },
  {
    id: 'sport-h-2',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'In cricket, what term denotes a bowler dismissing three consecutive batsmen with three consecutive deliveries in a single match?',
    options: ['Googly', 'Hat-trick', 'Century', 'Maiden over'],
    correctAnswerIndex: 1,
    explanation: 'A hat-trick occurs when a bowler takes three wickets on three successive legal deliveries.'
  },
  {
    id: 'sport-h-3',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'Which Formula 1 driver holds the joint-record for the most World Drivers\' Championships with 7 titles alongside Lewis Hamilton?',
    options: ['Ayrton Senna', 'Michael Schumacher', 'Alain Prost', 'Sebastian Vettel'],
    correctAnswerIndex: 1,
    explanation: 'Michael Schumacher won seven F1 titles (1994, 1995 with Benetton, and 2000–2004 with Ferrari).'
  },
  {
    id: 'sport-h-4',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'In rugby union, how many total points is a successfully grounded try worth under modern rules?',
    options: ['3 points', '4 points', '5 points', '6 points'],
    correctAnswerIndex: 2,
    explanation: 'In 1992, the International Rugby Football Board increased the value of a grounded try from 4 points to 5 points.'
  },
  {
    id: 'sport-h-5',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'What is the oldest active international sporting trophy in the world, contested in yacht racing since 1851?',
    options: ['The Ashes', 'America\'s Cup', 'Stanley Cup', 'Davis Cup'],
    correctAnswerIndex: 1,
    explanation: 'The America\'s Cup was first awarded in 1851 by the Royal Yacht Squadron for a race around the Isle of Wight.'
  },
  {
    id: 'sport-h-6',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'Which legendary athlete scored 100 points in a single NBA basketball game on March 2, 1962?',
    options: ['Kareem Abdul-Jabbar', 'Wilt Chamberlain', 'Michael Jordan', 'Bill Russell'],
    correctAnswerIndex: 1,
    explanation: 'Wilt Chamberlain scored 100 points for the Philadelphia Warriors against the New York Knicks in Hershey, PA.'
  },
  {
    id: 'sport-h-7',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'In fencing, which of the three competitive weapons permits valid touches only with the tip/point against the torso only?',
    options: ['Sabre', 'Épée', 'Foil', 'Rapier'],
    correctAnswerIndex: 2,
    explanation: 'Foil is a thrusting weapon whose valid target area is strictly the trunk (torso), governed by right-of-way rules.'
  },
  {
    id: 'sport-h-8',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'Which country hosted the inaugural FIFA Men\'s World Cup in 1930 and won the tournament title?',
    options: ['Brazil', 'Argentina', 'Uruguay', 'Italy'],
    correctAnswerIndex: 2,
    explanation: 'Uruguay hosted the first World Cup in Montevideo in July 1930, defeating Argentina 4-2 in the final.'
  },
  {
    id: 'sport-h-9',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'In baseball, what is the term for a game where a pitcher throws a complete 9-inning game without allowing a single baserunner?',
    options: ['No-hitter', 'Shutout', 'Perfect Game', 'Complete Game'],
    correctAnswerIndex: 2,
    explanation: 'A perfect game requires retiring all 27 batters in order with no hits, walks, hit batsmen, or defensive errors.'
  },
  {
    id: 'sport-h-10',
    category: 'Sports',
    difficulty: 'Hard',
    question: 'What is the total distance of an official Ironman Triathlon combining swim, bike, and marathon run?',
    options: ['100.0 km', '140.6 miles (226 km)', '70.3 miles (113 km)', '200.0 km'],
    correctAnswerIndex: 1,
    explanation: 'An Ironman consists of a 2.4-mile (3.86 km) swim, 112-mile (180.25 km) bike ride, and 26.22-mile (42.20 km) marathon.'
  }
];

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Prepares a question by shuffling its options and updating the correct answer index accordingly.
 */
function prepareQuestionWithOptionsShuffled(q: Question): Question {
  const originalCorrect = q.options[q.correctAnswerIndex];
  const shuffledOptions = shuffleArray(q.options);
  const newCorrectIndex = shuffledOptions.indexOf(originalCorrect);

  return {
    ...q,
    options: shuffledOptions,
    correctAnswerIndex: newCorrectIndex
  };
}

/**
 * Generates a 10-question quiz set strictly based on BOTH the selected Category and Difficulty.
 */
export function getQuizQuestions(
  category: Category,
  difficulty: Difficulty,
  count: number = 10
): Question[] {
  // Filter for exact Category and Difficulty match
  const filtered = QUESTION_POOL.filter(
    (q) => q.category === category && q.difficulty === difficulty
  );

  let selected: Question[] = [];

  if (filtered.length >= count) {
    selected = shuffleArray(filtered).slice(0, count);
  } else {
    // If fewer than count exist, pick all filtered, then top-up from the same category
    selected = [...filtered];
    const sameCatOtherDiff = QUESTION_POOL.filter(
      (q) => q.category === category && q.difficulty !== difficulty
    );
    const needed = count - selected.length;
    selected.push(...shuffleArray(sameCatOtherDiff).slice(0, needed));
  }

  // Shuffle options for fair gameplay
  return selected.map(prepareQuestionWithOptionsShuffled);
}
