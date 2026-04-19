export type RoleId = 'E1' | 'E2' | 'E3' | 'E4' | 'P'

export type RoleDefinition = {
  title: string
  responsibilities: string
  keyMissions: string
}

/** Rôles du projet — source unique pour la modale et les cartes */
export const ROLES: Record<RoleId, RoleDefinition> = {
  E1: {
    title: 'Product Owner / Scrum Master',
    responsibilities: 'Backlog, sprints, coordination, démonstrations',
    keyMissions:
      'Rédiger les histoires utilisateur, animer les stand-ups, suivre les jalons, préparer la démo MVP',
  },
  E2: {
    title: 'Responsable backend',
    responsibilities: 'API REST, modèle de données, authentification',
    keyMissions:
      'Authentification JWT, CRUD prestations et contrats, logique de tarification, gestion des statuts',
  },
  E3: {
    title: 'Responsable frontend',
    responsibilities: 'Interface, agenda, formulaires, exports',
    keyMissions:
      'Intégration des écrans, vue agenda filtrable, formulaires, mise en page responsive, export CSV',
  },
  E4: {
    title: 'DevOps / développement full stack',
    responsibilities: 'Dépôt GitHub, intégration continue, déploiement, base de données',
    keyMissions:
      'Mise en place GitHub (branches, PR, CI), migrations de la base, jeux de données de test, déploiement sur un environnement de démo',
  },
  P: {
    title: 'Professeur / chef de produit',
    responsibilities: 'Vision produit, arbitrages, validation',
    keyMissions:
      'Validation des choix techniques et fonctionnels, retours UX, décision go/no-go pour la livraison MVP',
  },
}

export type TeamMember = {
  name: string
  roleIds: RoleId[]
  /** Si absent, une URL d’avatar est dérivée du nom (voir `avatarUrlFor` dans `lib/team.ts`). */
  avatarUrl?: string
}

export const teamMembers: TeamMember[] = [
  { name: 'Vardanyan Artur', roleIds: ['P', 'E4'] },
  { name: 'Liogier Nolan', roleIds: ['E1', 'E4'] },
  { name: 'Akyurek Eren', roleIds: ['E2'] },
  { name: 'Lea Sourmail', roleIds: ['E2'] },
  { name: 'Houpert Mathéo', roleIds: ['E3'] },
]
