// seedFirestore.js
import { setDoc, doc } from "firebase/firestore";
import { db } from "./config.js";

export const faculties = [
  { id: "fac-ciencias-agrarias", name: "FACULTAD DE CIENCIAS AGRARIAS" },
  { id: "fac-ingenieria-agricola", name: "FACULTAD DE INGENIERIA AGRICOLA" },
  {
    id: "fac-civil-arquitectura",
    name: "FACULTAD DE INGENIERIA CIVIL Y ARQUITECTURA",
    websites: [
      "https://fisica.unap.edu.pe/",
      "https://matematicas.unap.edu.pe/",
    ],
  },
  { id: "fac-ingenieria-economica", name: "FACULTAD DE INGENIERIA ECONOMICA" },
  {
    id: "fac-ingenieria-estadistica-informatica",
    name: "FACULTAD DE INGENIERIA ESTADISTICA E INFORMATICA",
  },
  {
    id: "fac-geologica-metalurgica",
    name: "FACULTAD DE INGENIERIA GEOLOGICA Y METALURGICA",
  },
  {
    id: "fac-mecanica-electrica-electronica-sistemas",
    name: "FACULTAD DE INGENIERIA MECANICA ELECTRICA, ELECTRONICA Y SISTEMAS",
  },
  { id: "fac-minas", name: "FACULTAD DE INGENIERIA DE MINAS" },
  { id: "fac-quimica", name: "FACULTAD DE INGENIERIA QUIMICA" },
  { id: "fac-ciencias-biologicas", name: "FACULTAD DE CIENCIAS BIOLOGICAS" },
  { id: "fac-ciencias-salud", name: "FACULTAD DE CIENCIAS DE LA SALUD" },
  { id: "fac-enfermeria", name: "FACULTAD DE ENFERMERIA" },
  { id: "fac-medicina-humana", name: "FACULTAD DE MEDICINA HUMANA" },
  {
    id: "fac-medicina-veterinaria",
    name: "FACULTAD DE MEDICINA VETERINARIA Y ZOOTECNIA",
  },
  {
    id: "fac-ciencias-contables",
    name: "FACULTAD DE CIENCIAS CONTABLES Y ADMINISTRATIVAS",
  },
  {
    id: "fac-ciencias-educacion",
    name: "FACULTAD DE CIENCIAS DE LA EDUCACION",
  },
  {
    id: "fac-ciencias-juridicas",
    name: "FACULTAD DE CIENCIAS JURIDICAS Y POLITICAS",
  },
  { id: "fac-ciencias-sociales", name: "FACULTAD DE CIENCIAS SOCIALES" },
  { id: "fac-trabajo-social", name: "FACULTAD DE TRABAJO SOCIAL" },
  {
    id: "fac-ciencias-adm-humanas",
    name: "FACULTAD DE CIENCIAS ADMINISTRATIVAS Y HUMANAS",
  },
];

export const schools = [
  // FACULTAD DE CIENCIAS AGRARIAS
  {
    id: "esc-ing-agronomica",
    name: "Escuela Profesional de Ingeniería Agronómica",
    facultyId: "fac-ciencias-agrarias",
  },
  {
    id: "esc-ing-agroindustrial",
    name: "Escuela Profesional de Ingeniería Agroindustrial",
    facultyId: "fac-ciencias-agrarias",
  },
  {
    id: "esc-ing-topografica",
    name: "Escuela Profesional de Ingeniería Topográfica y Agrimensura",
    facultyId: "fac-ciencias-agrarias",
  },

  // FACULTAD DE INGENIERIA AGRICOLA
  {
    id: "esc-ing-agricola",
    name: "Escuela Profesional de Ingeniería Agrícola",
    facultyId: "fac-ingenieria-agricola",
  },

  // FACULTAD DE INGENIERIA CIVIL Y ARQUITECTURA
  {
    id: "esc-ing-civil",
    name: "Escuela Profesional de Ingeniería Civil - Acred. ICACIT",
    facultyId: "fac-civil-arquitectura",
  },
  {
    id: "esc-arquitectura",
    name: "Escuela Profesional de Arquitectura y Urbanismo",
    facultyId: "fac-civil-arquitectura",
  },

  // FACULTAD DE INGENIERIA ECONOMICA
  {
    id: "esc-ing-economica",
    name: "Escuela Profesional de Ingeniería Económica",
    facultyId: "fac-ingenieria-economica",
  },

  // FACULTAD DE INGENIERIA ESTADISTICA E INFORMATICA
  {
    id: "esc-ing-estadistica-informatica",
    name: "Escuela Profesional de Ingeniería Estadística e Informática",
    facultyId: "fac-ingenieria-estadistica-informatica",
  },

  // FACULTAD DE INGENIERIA GEOLOGICA Y METALURGICA
  {
    id: "esc-ing-geologica",
    name: "Escuela Profesional de Ingeniería Geológica",
    facultyId: "fac-geologica-metalurgica",
  },
  {
    id: "esc-ing-metalurgica",
    name: "Escuela Profesional de Ingeniería Metalúrgica",
    facultyId: "fac-geologica-metalurgica",
  },

  // FACULTAD DE INGENIERIA MECANICA ELECTRICA, ELECTRONICA Y SISTEMAS
  {
    id: "esc-ing-electronica",
    name: "Escuela Profesional de Ingeniería Electrónica",
    facultyId: "fac-mecanica-electrica-electronica-sistemas",
  },
  {
    id: "esc-ing-mecanica-electrica",
    name: "Escuela Profesional de Ingeniería Mecánica Eléctrica",
    facultyId: "fac-mecanica-electrica-electronica-sistemas",
  },
  {
    id: "esc-ing-sistemas",
    name: "Escuela Profesional de Ingeniería de Sistemas",
    facultyId: "fac-mecanica-electrica-electronica-sistemas",
  },

  // FACULTAD DE INGENIERIA DE MINAS
  {
    id: "esc-ing-minas",
    name: "Escuela Profesional de Ingenieria de Minas",
    facultyId: "fac-minas",
  },

  // FACULTAD DE INGENIERIA QUIMICA
  {
    id: "esc-ing-quimica",
    name: "Escuela Profesional de Ingeniería Química",
    facultyId: "fac-quimica",
  },

  // FACULTAD DE CIENCIAS BIOLOGICAS
  {
    id: "esc-ciencias-biologicas",
    name: "Escuela Profesional de Ciencias Biológicas",
    facultyId: "fac-ciencias-biologicas",
  },
  {
    id: "esc-pesqueria",
    name: "Escuela Profesional de Ciencias Biológicas: Pesquería",
    facultyId: "fac-ciencias-biologicas",
  },
  {
    id: "esc-microbiologia",
    name: "Escuela Profesional de Ciencias Biológicas: Microbiología",
    facultyId: "fac-ciencias-biologicas",
  },

  // FACULTAD DE CIENCIAS DE LA SALUD
  {
    id: "esc-nutricion",
    name: "Escuela Profesional de Nutrición Humana",
    facultyId: "fac-ciencias-salud",
  },
  {
    id: "esc-odontologia",
    name: "Escuela Profesional de Odontología",
    facultyId: "fac-ciencias-salud",
  },

  // FACULTAD DE ENFERMERIA
  {
    id: "esc-enfermeria",
    name: "Escuela Profesional de Enfermería",
    facultyId: "fac-enfermeria",
  },

  // FACULTAD DE MEDICINA HUMANA
  {
    id: "esc-medicina-humana",
    name: "Escuela Profesional de Medicina Humana",
    facultyId: "fac-medicina-humana",
  },

  // FACULTAD DE MEDICINA VETERINARIA Y ZOOTECNIA
  {
    id: "esc-medicina-veterinaria",
    name: "Escuela Profesional de Medicina Veterinaria y Zootecnia",
    facultyId: "fac-medicina-veterinaria",
  },

  // FACULTAD DE CIENCIAS CONTABLES Y ADMINISTRATIVAS
  {
    id: "esc-ciencias-contables",
    name: "Escuela Profesional de Ciencias Contables",
    facultyId: "fac-ciencias-contables",
  },

  // FACULTAD DE CIENCIAS DE LA EDUCACION
  {
    id: "esc-fisica",
    name: "Escuela Profesional de Física",
    facultyId: "fac-ciencias-educacion",
    website: "https://fisica.unap.edu.pe/",
  },
  {
    id: "esc-inicial",
    name: "Escuela Profesional de Inicial",
    facultyId: "fac-ciencias-educacion",
  },
  {
    id: "esc-primaria",
    name: "Escuela Profesional de Primaria",
    facultyId: "fac-ciencias-educacion",
  },
  {
    id: "esc-secundaria-sociales",
    name: "Escuela Profesional de Secundaria: Sociales",
    facultyId: "fac-ciencias-educacion",
    website: "https://secundariasociales.unap.edu.pe",
  },
  {
    id: "esc-secundaria-literatura",
    name: "Escuela Profesional de Secundaria: Literatura",
    facultyId: "fac-ciencias-educacion",
    website: "https://secundarialiteratura.unap.edu.pe",
  },
  {
    id: "esc-secundaria-matematica",
    name: "Escuela Profesional de Secundaria: Matemática",
    facultyId: "fac-ciencias-educacion",
    website: "https://secundariamatematica.unap.edu.pe",
  },

  // FACULTAD DE CIENCIAS JURIDICAS Y POLITICAS
  {
    id: "esc-derecho",
    name: "Escuela Profesional de Derecho",
    facultyId: "fac-ciencias-juridicas",
  },

  // FACULTAD DE CIENCIAS SOCIALES
  {
    id: "esc-antropologia",
    name: "Escuela Profesional de Antropología",
    facultyId: "fac-ciencias-sociales",
  },
  {
    id: "esc-arte",
    name: "Escuela Profesional de Arte",
    facultyId: "fac-ciencias-sociales",
  },
  {
    id: "esc-danza",
    name: "Danza (Arte)",
    facultyId: "fac-ciencias-sociales",
    website: "https://danza.unap.edu.pe",
  },
  {
    id: "esc-musica",
    name: "Música (Arte)",
    facultyId: "fac-ciencias-sociales",
    website: "https://musica.unap.edu.pe",
  },
  {
    id: "esc-teatro",
    name: "Teatro (Arte)",
    facultyId: "fac-ciencias-sociales",
    website: "https://teatro.unap.edu.pe",
  },
  {
    id: "esc-comunicacion",
    name: "Escuela Profesional de Ciencias de la Comunicación Social",
    facultyId: "fac-ciencias-sociales",
  },
  {
    id: "esc-sociologia",
    name: "Escuela Profesional de Sociología",
    facultyId: "fac-ciencias-sociales",
  },
  {
    id: "esc-turismo",
    name: "Escuela Profesional de Turismo",
    facultyId: "fac-ciencias-sociales",
  },

  // FACULTAD DE TRABAJO SOCIAL
  {
    id: "esc-trabajo-social",
    name: "Escuela Profesional de Trabajo Social",
    facultyId: "fac-trabajo-social",
  },

  // FACULTAD DE CIENCIAS ADMINISTRATIVAS Y HUMANAS
  {
    id: "esc-administracion",
    name: "Escuela Profesional de Administración",
    facultyId: "fac-ciencias-adm-humanas",
  },
];

const students = [
  {
    id: "stu-215253",
    full_name: "ANGIE TATIANA LUQUE PACHECO",
    code: "215253",
    career: "ING. DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [1, 3],
    email: "215253@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-251399",
    full_name: "RANDY DECO ISAAC MEDINA CHOQUEPATA",
    code: "251399",
    career: "CIENCIA FISICA MATEMATICAS",
    faculty: "FACULTAD DE CIENCIAS",
    school: "Escuela Profesional de Ciencias Físico Matemáticas",
    selectedDays: [2, 4],
    email: "251399@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-215868",
    full_name: "ELFER MAMANI TURPO",
    code: "215868",
    career: "ING. DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [1, 4],
    email: "215868@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-220335",
    full_name: "MAYKOL ANDRED PUMA MESCCO",
    code: "220335",
    career: "ARQUITECTURA Y URBANISMO",
    faculty: "FACULTAD DE ARQUITECTURA",
    school: "Escuela Profesional de Arquitectura y Urbanismo",
    selectedDays: [3, 5],
    email: "220335@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-256802",
    full_name: "ANTHONY SEBASTIÁN GAVILANO AZA",
    code: "256802",
    career: "INGENIERIA DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [2, 5],
    email: "256802@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217038",
    full_name: "JHON MARCO ARACAYO MAMANI",
    code: "217038",
    career: "INGENIERIA DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [1, 3],
    email: "217038@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217473",
    full_name: "AARON ROGER VILCA CARI",
    code: "217473",
    career: "INGENIERIA DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [2, 4],
    email: "217473@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-215304",
    full_name: "ANGEL PEDRO QUISPE TICONA",
    code: "215304",
    career: "ING. DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [1, 4],
    email: "215304@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-215116",
    full_name: "MARK WILL CCALLO CAHMBI",
    code: "215116",
    career: "ING. DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [3, 5],
    email: "215116@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217498",
    full_name: "WIDVAR GUSTAVO CONDORI COAQUIRA",
    code: "217498",
    career: "ING. DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [2, 4],
    email: "217498@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217012",
    full_name: "MARK JHUSBEL MAYTA ATAMARI",
    code: "217012",
    career: "ING. DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [1, 3],
    email: "217012@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-241469",
    full_name: "LISBETH MAGALY LIMA CONDORI",
    code: "241469",
    career: "ANTROPOLOGÍA",
    faculty: "FACULTAD DE CIENCIAS SOCIALES",
    school: "Escuela Profesional de Antropología",
    selectedDays: [2, 5],
    email: "241469@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-241671",
    full_name: "MIRIAN IBETH SOLIS TINTAYA",
    code: "241671",
    career: "ANTROPOLOGÍA",
    faculty: "FACULTAD DE CIENCIAS SOCIALES",
    school: "Escuela Profesional de Antropología",
    selectedDays: [3, 4],
    email: "241671@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-251288",
    full_name: "TONY JEFFERSON CACERES LUVI",
    code: "251288",
    career: "INGENIERÍA TOPOGRÁFICA Y AGRIMENSURA",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería Topográfica y Agrimensura",
    selectedDays: [1, 4],
    email: "251288@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217397",
    full_name: "VICTOR RAUL MAYE MAMANI",
    code: "217397",
    career: "ING. ESTADISTICA E INFORMATICA",
    faculty: "FACULTAD DE CIENCIAS",
    school: "Escuela Profesional de Estadística e Informática",
    selectedDays: [2, 5],
    email: "217397@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217151",
    full_name: "RONALD ALEX DÍAZ PARI",
    code: "217151",
    career: "ING. ESTADISTICA E INFORMATICA",
    faculty: "FACULTAD DE CIENCIAS",
    school: "Escuela Profesional de Estadística e Informática",
    selectedDays: [1, 3],
    email: "217151@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-215370",
    full_name: "JULIO SEGUNDO EDUARDO MAQUERA",
    code: "215370",
    career: "ING. ESTADISTICA E INFORMATICA",
    faculty: "FACULTAD DE CIENCIAS",
    school: "Escuela Profesional de Estadística e Informática",
    selectedDays: [2, 4],
    email: "215370@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-215112",
    full_name: "MARCOS CRISTIAN MAMANI CHIPANA",
    code: "215112",
    career: "ING. ESTADISTICA E INFORMATICA",
    faculty: "FACULTAD DE CIENCIAS",
    school: "Escuela Profesional de Estadística e Informática",
    selectedDays: [3, 5],
    email: "215112@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217520",
    full_name: "CLEVER JOEL MAMANI ARI",
    code: "217520",
    career: "ING. ESTADISTICA E INFORMATICA",
    faculty: "FACULTAD DE CIENCIAS",
    school: "Escuela Profesional de Estadística e Informática",
    selectedDays: [1, 4],
    email: "217520@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-240188",
    full_name: "RANDY OMAR PARISACA CHAMBI",
    code: "240188",
    career: "ING. ELECTRONICA",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería Electrónica",
    selectedDays: [2, 5],
    email: "240188@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-215317",
    full_name: "BRYNER CCALLI QUELCAHUANCA",
    code: "215317",
    career: "ING. CIVIL",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería Civil",
    selectedDays: [3, 4],
    email: "215317@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-241630",
    full_name: "JEAN FRANCO MAMANI CALSINA",
    code: "241630",
    career: "ANTROPOLOGIA",
    faculty: "FACULTAD DE CIENCIAS SOCIALES",
    school: "Escuela Profesional de Antropología",
    selectedDays: [1, 5],
    email: "241630@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217254",
    full_name: "RENE ROLANDO CCOYTO PACHAPUMA",
    code: "217254",
    career: "ING. ESTADISTICA E INFORMATICA",
    faculty: "FACULTAD DE CIENCIAS",
    school: "Escuela Profesional de Estadística e Informática",
    selectedDays: [2, 4],
    email: "217254@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217055",
    full_name: "MARCIAL DINO ITUSACA BELTRÁN",
    code: "217055",
    career: "ING. ECONOMICA",
    faculty: "FACULTAD DE ECONOMÍA",
    school: "Escuela Profesional de Ingeniería Económica",
    selectedDays: [3, 5],
    email: "217055@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-227868",
    full_name: "MARIA VANESA YUCRA MENDOZA",
    code: "227868",
    career: "ING. DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [1, 4],
    email: "227868@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-231288",
    full_name: "DELIA ROSA ALVAREZ LOPE",
    code: "231288",
    career: "ING. QUIMICA",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería Química",
    selectedDays: [2, 5],
    email: "231288@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-240121",
    full_name: "CÉSAR AUGUSTO BUSTAMANTE TORRES",
    code: "240121",
    career: "ING. ELECTRONICA",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería Electrónica",
    selectedDays: [3, 4],
    email: "240121@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217356",
    full_name: "LAYMIR SEBASTIÁN APAZA AJROTA",
    code: "217356",
    career: "ING. ESTADISTICA E INFORMATICA",
    faculty: "FACULTAD DE CIENCIAS",
    school: "Escuela Profesional de Estadística e Informática",
    selectedDays: [1, 5],
    email: "217356@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-229492",
    full_name: "PAMELA TICONA APARICIO",
    code: "229492",
    career: "ING. DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [2, 4],
    email: "229492@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-217271",
    full_name: "OSCAR ANDRES CARI YANA",
    code: "217271",
    career: "ING. DE SISTEMAS",
    faculty: "FACULTAD DE INGENIERÍA",
    school: "Escuela Profesional de Ingeniería de Sistemas",
    selectedDays: [3, 5],
    email: "217271@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-251739",
    full_name: "MARIA MAMANI BARRIONUEVO",
    code: "251739",
    career: "ANTROPOLOGIA",
    faculty: "FACULTAD DE CIENCIAS SOCIALES",
    school: "Escuela Profesional de Antropología",
    selectedDays: [1, 3],
    email: "251739@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "stu-250609",
    full_name: "STEFHANIE ANAI MONTORA NINA",
    code: "250609",
    career: "ANTROPOLOGIA",
    faculty: "FACULTAD DE CIENCIAS SOCIALES",
    school: "Escuela Profesional de Antropología",
    selectedDays: [2, 4],
    email: "250609@una.edu.pe",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

async function seedFirestore() {
  try {
    // 1) Facultades (colección plana)
    for (const f of faculties) {
      const ref = doc(db, "faculties", f.id);
      const payload = { name: f.name };
      if (f.websites) payload.websites = f.websites;
      await setDoc(ref, payload);
      console.log("Facultad creada:", f.id);
    }

    // 2) Escuelas (colección plana) con facultyId
    for (const s of schools) {
      const ref = doc(db, "schools", s.id);
      const payload = { name: s.name, facultyId: s.facultyId };
      if (s.website) payload.website = s.website;
      await setDoc(ref, payload);
      console.log("Escuela creada:", s.id);
    }

    // // 3) Students (duplica faculty & school names para denormalización)
    // for (const st of exampleStudents) {
    //   const ref = doc(db, "students", st.id);
    //   await setDoc(ref, st);
    //   console.log("Student creado:", st.id);
    // }

    console.log(
      "✅ Seed completado siguiendo modelo NoSQL (colecciones planas + denormalización)."
    );
  } catch (err) {
    console.error("Error en seedFirestore:", err);
  }
}

async function seedStudentsOnly() {
  try {
    // 3) Students (duplica faculty & school names para denormalización)
    for (const st of students) {
      const ref = doc(db, "students", st.id);
      await setDoc(ref, st);
      console.log("Student creado:", st.id);
    }
  } catch (err) {
    console.error("Error en seedStudentsOnly:", err);
  }
}

// Ejecutar la función de seed
// seedStudentsOnly();
// seedFirestore();
