// utils/bcrypt.ts

// Importe la bibliothèque bcryptjs pour le hachage des mots de passe.
// 'bcryptjs' est une implémentation pure JavaScript de bcrypt, compatible avec Bun.
import bcrypt from 'bcryptjs';

// Nombre de "rounds" (itérations) pour le salage et le hachage de Bcrypt.
// Plus ce nombre est élevé, plus le hachage est sécurisé, mais plus il est lent.
// 10 est une valeur courante et sécurisée pour la plupart des applications.
const SALT_ROUNDS = 10;

/**
 * @function hashPassword
 * @description Hashe un mot de passe en utilisant Bcrypt.
 * @param {string} password Le mot de passe en clair à hacher.
 * @returns {Promise<string>} Une promesse qui résout en le mot de passe haché.
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Génère un sel unique, puis hashe le mot de passe avec ce sel.
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe:', error);
    throw new Error('Impossible de hacher le mot de passe.');
  }
};

/**
 * @function comparePassword
 * @description Compare un mot de passe en clair avec un mot de passe haché.
 * @param {string} password Le mot de passe en clair fourni par l'utilisateur.
 * @param {string} hashedPassword Le mot de passe haché stocké dans la base de données.
 * @returns {Promise<boolean>} Une promesse qui résout à true si les mots de passe correspondent, false sinon.
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    // Compare le mot de passe en clair avec le haché. Bcrypt gère la dérivation du sel.
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Erreur lors de la comparaison des mots de passe:', error);
    throw new Error('Impossible de comparer les mots de passe.');
  }
};