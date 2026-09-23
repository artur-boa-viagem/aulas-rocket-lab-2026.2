import type { Game, Review } from "../types";

export const games: Game[] = [
  {
    id: "zelda-botw",
    title: "The Legend of Zelda: Breath of the Wild",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
    synopsis:
      "Link acorda após 100 anos de sono e precisa libertar Hyrule de Ganon. Mundo aberto gigante, com física livre, santuários e exploração sem ordem fixa.",
  },
  {
    id: "gow-ragnarok",
    title: "God of War Ragnarök",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg",
    synopsis:
      "Kratos e Atreus enfrentam o fim dos nove reinos na mitologia nórdica. Combate visceral, história sobre paternidade e escolhas.",
  },
  {
    id: "minecraft",
    title: "Minecraft",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/pt/9/9c/Minecraft_capa.png?utm_source=pt.wikipedia.org&utm_campaign=index&utm_content=original",
    synopsis:
      "O sandbox mais jogado do mundo: construa, explore cavernas, sobreviva a monstros e crie praticamente qualquer coisa com blocos.",
  },
];

export const initialReviews: Review[] = [
  {
    id: "r1",
    gameId: "zelda-botw",
    userName: "Usuário 1",
    text: "Mundo aberto impecável, zerei 3 vezes e ainda acho santuário novo!",
    rating: 5,
    timesFinished: 3,
  },
  {
    id: "r2",
    gameId: "zelda-botw",
    userName: "Usuário 2",
    text: "Começo lento, mas depois vicia. Dungeons poderiam ser melhores.",
    rating: 4,
    timesFinished: 1,
  },
  {
    id: "r3",
    gameId: "gow-ragnarok",
    userName: "Usuário 1",
    text: "História emocionante, chorei no final. Combate 10/10.",
    rating: 5,
    timesFinished: 2,
  },
];
