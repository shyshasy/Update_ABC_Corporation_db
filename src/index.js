const readlineSync = require('readline-sync');
const customerManager = require('./customer');
const productManager = require('./product');
const orderManager = require('./purchaseOrder');
const paymentManager = require('./payment');

async function mainMenu() {
  console.log("1. Gestion des clients");
  console.log("2. Gestion des produits");
  console.log("3. Gestion des commandes");
  console.log("4. Gestion des paiements");
  console.log("0. Quitter");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function customerMenu() {
  console.log("1. Ajouter un client");
  console.log("2. Lister tous les clients");
  console.log("3. Mettre à jour un client");
  console.log("4. Supprimer un client");
  console.log("0. Retour au menu principal");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function handleCustomerMenu() {
  let choix;
  do {
    choix = await customerMenu();
    switch (choix) {
      case '1':
        const name = readlineSync.question("Nom du client: ");
        const email = readlineSync.question("Email du client: ");
        const phone = readlineSync.question("Téléphone du client: ");
        const address = readlineSync.question("Adresse du client: ");
        await customerManager.addCustomer(name, email, phone, address);
        console.log("Client ajouté avec succès !");
        break;

      case '2':
        const customers = await customerManager.getCustomers();
        console.log("Liste des clients:", customers);
        break;

      case '3':
        const customerIdToUpdate = readlineSync.questionInt("ID du client à mettre à jour: ");
        const newName = readlineSync.question("Nouveau nom du client: ");
        const newEmail = readlineSync.question("Nouvel email du client: ");
        const newPhone = readlineSync.question("Nouveau téléphone du client: ");
        const newAddress = readlineSync.question("Nouvelle adresse du client: ");
        await customerManager.updateCustomer(customerIdToUpdate, newName, newEmail, newPhone, newAddress);
        console.log("Client mis à jour avec succès !");
        break;

      case '4':
        const customerIdToDelete = readlineSync.questionInt("ID du client à supprimer: ");
        await customerManager.deleteCustomer(customerIdToDelete);
        console.log("Client supprimé avec succès !");
        break;

      case '0':
        console.log("Retour au menu principal");
        break;

      default:
        console.log("Choix invalide, veuillez réessayer.");
    }
  } while (choix !== '0');
}

// async function productMenu() {
//   console.log("1. Ajouter un produit");
//   console.log("2. Lister tous les produits");
//   console.log("3. Mettre à jour un produit");
//   console.log("4. Supprimer un produit");
//   console.log("0. Retour au menu principal");
//   const choix = readlineSync.question("Votre choix: ");
//   return choix;
// }

// async function productMenu() {
//   console.log("1. Ajouter un produit");
//   console.log("2. Lister tous les produits");
//   console.log("3. Mettre à jour un produit");
//   console.log("4. Supprimer un produit");
//   console.log("0. Retour au menu principal");
//   const choix = readlineSync.question("Votre choix: ");
//   return choix;
// }
async function productMenu() {
  console.log("1. Ajouter un produit");
  console.log("2. Lister tous les produits");
  console.log("3. Mettre à jour un produit");
  console.log("4. Supprimer un produit");
  console.log("q. Quitter le menu");
  const choix = readlineSync.question("Votre choix : ");
  return choix;
}

async function handleProductMenu() {
  let choix;

  do {
    choix = await productMenu();
    try {
      switch (choix) {
        case '1': // Ajouter un produit
          let codeBarresUnique = false;
          let codeBarres;

          while (!codeBarresUnique) {
            const nomProduit = readlineSync.question("Nom du produit : ");
            const description = readlineSync.question("Description du produit : ");
            const prix = readlineSync.questionFloat("Prix du produit : ");
            const stock = readlineSync.questionInt("Quantité en stock : ");
            const categorie = readlineSync.question("Catégorie du produit : ");
            codeBarres = readlineSync.question("Code-barres du produit : ");
            const statut = readlineSync.question("Statut (available/unavailable) : ");

            if (!['available', 'unavailable'].includes(statut)) {
              console.error('Erreur : Statut invalide. Utilisez "available" ou "unavailable".');
              break; // Sortir de la boucle si le statut est invalide
            }

            try {
              // Tenter d'ajouter le produit
              await productManager.addProduct(nomProduit, description, prix, stock, categorie, codeBarres, statut);
              codeBarresUnique = true; // Code-barres est unique, produit ajouté
              console.log("Produit ajouté avec succès !");
            } catch (error) {
              if (error.message.includes('Le produit avec le code-barres')) {
                // Remplacer le message d'erreur technique par un message plus clair
                console.error("Erreur : Ce code-barres est déjà utilisé pour un autre produit. Veuillez choisir un code-barres différent.");
              } else {
                // Gérer toute autre erreur
                console.error("Erreur lors de l'ajout du produit :", error.message);
              }
            }
          }
          break;

        // Autres options du menu...

        default:
          if (choix !== 'q') {
            console.log("Option non reconnue. Veuillez choisir une option valide.");
          }
      }
    } catch (error) {
      console.error("Erreur lors de l'exécution de l'option :", error.message);
    }
  } while (choix !== 'q'); 
}


async function orderMenu() {
  const choices = [
    'Ajouter une nouvelle commande avec ses détails',
    'Mettre à jour les informations d\'une commande et ses détails',
    'Supprimer une commande avec ses détails',
    'Lister une commande avec ses détails',
    'Retour'
  ];

  const index = readlineSync.keyInSelect(choices, 'Choisissez une option:');
  return index;
}

async function orderDetailMenu() {
  console.log("1. Ajouter un détail de commande");
  console.log("2. Mettre à jour un détail de commande");
  console.log("3. Supprimer un détail de commande");
  console.log("4. Afficher les détails de la commande");
  console.log("0. Retour au menu des commandes");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function handleOrderMenu() {
  let choix;

  do {
    choix = await orderMenu();

    switch (choix) {
      case 0: // Ajouter une nouvelle commande avec ses détails
        await addOrder();
        break;

      case 1: // Mettre à jour les informations d'une commande et ses détails
        await updateOrder();
        break;

      case 2: // Supprimer une commande avec ses détails
        await deleteOrder();
        break;

      case 3: // Lister une commande avec ses détails
        await listOrder();
        break;

      case 4: // Retour
        console.log('Retour au menu principal.');
        break;

      default:
        console.log('Option invalide. Veuillez choisir une option valide.');
        break;
    }
  } while (choix !== 4); // 4 correspond à "Retour"
}

async function addOrder() {
  // Demander les informations de la commande
  const orderDate = readlineSync.question('Date de la commande (YYYY-MM-DD): ');
  const deliveryAddress = readlineSync.question('Adresse de livraison: ');
  const customerId = readlineSync.questionInt('ID du client: ');
  const trackNumber = readlineSync.question('Numéro de suivi: ');
  const status = readlineSync.question('Statut de la commande (pending/shipped/completed): ');

  // Validation du statut
  if (!['pending', 'shipped', 'completed'].includes(status)) {
    console.log('Erreur: Statut de la commande invalide. Utilisez "pending", "shipped", ou "completed".');
    return;
  }

  // Gestion des détails de la commande
  let orderDetails = [];
  let detailChoice;

  do {
    detailChoice = readlineSync.keyInSelect(
      ['Ajouter un produit', 'Sauvegarder', 'Annuler l\'ajout'],
      'Choisissez une option:'
    );

    switch (detailChoice) {
      case 0: // Ajouter un produit
        const productId = readlineSync.questionInt('ID du produit: ');
        const quantity = readlineSync.questionInt('Quantité du produit: ');
        const price = readlineSync.questionFloat('Prix du produit: ');

        // Validation des détails du produit
        if (isNaN(productId) || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
          console.log('Erreur: Assurez-vous que les valeurs du produit sont correctes.');
          break;
        }

        // Ajouter le produit aux détails de la commande
        orderDetails.push({ productId, quantity, price });
        break;

      case 1: // Sauvegarder
        try {
          // Ajouter la commande avec ses détails
          await orderManager.addOrderWithDetails(
            customerId, // ID du client
            orderDate, 
            deliveryAddress,
            trackNumber,
            status,
            orderDetails
          );
          console.log('Commande et détails créés avec succès.');
        } catch (error) {
          console.log('Le numéro de suivi saisi existe déjà. Veuillez entrer un autre numéro.');
        }
        
        break;

      case 2: // Annuler l'ajout
        console.log('Annulation de l\'ajout.');
        break;
    }
  } while (detailChoice !== 1 && detailChoice !== 2);
}

async function updateOrder() {
  // Mettre à jour une commande
  const orderId = readlineSync.questionInt('ID de la commande à mettre à jour: ');

  // Obtenez les nouvelles informations
  const newOrderDate = readlineSync.question('Nouvelle date de la commande (YYYY-MM-DD): ');
  const newDeliveryAddress = readlineSync.question('Nouvelle adresse de livraison: ');
  const newTrackNumber = readlineSync.question('Nouveau numéro de suivi: ');
  const newStatus = readlineSync.question('Nouveau statut de la commande (pending/shipped/completed): ');

  // Validation du statut
  if (!['pending', 'shipped', 'completed'].includes(newStatus)) {
    console.log('Erreur: Statut de la commande invalide. Utilisez "pending", "shipped", ou "completed".');
    return;
  }

  try {
    
    await orderManager.updateOrderWithDetails,(orderId, newOrderDate, newDeliveryAddress, newTrackNumber, newStatus);
    console.log('Commande mise à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error.message);
  }
}

async function deleteOrder() {
  // Supprimer une commande
  const orderId = readlineSync.questionInt('ID de la commande à supprimer: ');

  try {
    await orderManager.deleteOrderWithDetails,(orderId);
    console.log('Commande supprimée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error.message);
  }
}

async function listOrder() {
  // Lister les commandes
  const orderId = readlineSync.questionInt('ID de la commande à afficher: ');

  try {
    const order = await orderManager.getOrderWithDetails(orderId);
    console.log('Commande:', order);
  } catch (error) {
    console.error('Erreur lors de l\'affichage de la commande:', error.message);
  }
}

async function paymentMenu() {
  console.log("1. Ajouter un paiement");
  console.log("2. Lister tous les paiements");
  console.log("3. Mettre à jour un paiement");
  console.log("4. Supprimer un paiement");
  console.log("0. Retour au menu principal");
  const choix = readlineSync.question("Votre choix: ");
  return choix;
}

async function handlePaymentMenu() {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  let choix;
  do {
    choix = await paymentMenu(); // Supposons que paymentMenu() retourne une promesse avec le choix de l'utilisateur
    switch (choix) {
      case '1':
        const paymentOrderId = readlineSync.questionInt("ID de la commande associée au paiement: ");
        const paymentAmount = readlineSync.questionFloat("Montant du paiement: ");
        const paymentDate = readlineSync.question("Date du paiement (YYYY-MM-DD): ");
        const paymentMethod = readlineSync.question("Méthode de paiement: "); // Ajout d'une méthode de paiement

        if (!dateRegex.test(paymentDate)) {
          console.log('Erreur : Le format de la date est invalide. Utilisez le format YYYY-MM-DD.');
          break;
        }

        try {
          await paymentManager.addPayment(paymentOrderId, paymentDate, paymentAmount, paymentMethod);
          console.log("Paiement ajouté avec succès !");
        } catch (error) {
          console.error('Erreur lors de l\'ajout du paiement:', error.message);
        }
        break;

      case '2':
        try {
          const payments = await paymentManager.getPayments();
          console.log("Liste des paiements:", payments);
        } catch (error) {
          console.error('Erreur lors de la récupération des paiements:', error.message);
        }
        break;

      case '3':
        const paymentIdToUpdate = readlineSync.questionInt("ID du paiement à mettre à jour: ");
        const newPaymentOrderId = readlineSync.questionInt("Nouvel ID de la commande associée au paiement: ");
        const newPaymentAmount = readlineSync.questionFloat("Nouveau montant du paiement: ");
        const newPaymentDate = readlineSync.question("Nouvelle date du paiement (YYYY-MM-DD): ");
        const newPaymentMethod = readlineSync.question("Nouvelle méthode de paiement: ");

        if (!dateRegex.test(newPaymentDate)) {
          console.log('Erreur : Le format de la date est invalide. Utilisez le format YYYY-MM-DD.');
          break;
        }

        try {
          await paymentManager.updatePayment(paymentIdToUpdate, newPaymentOrderId, newPaymentDate, newPaymentAmount, newPaymentMethod);
          console.log("Paiement mis à jour avec succès !");
        } catch (error) {
          console.error('Erreur lors de la mise à jour du paiement:', error.message);
        }
        break;

      case '4':
        const paymentIdToDelete = readlineSync.questionInt("ID du paiement à supprimer: ");
        try {
          await paymentManager.deletePayment(paymentIdToDelete);
          console.log("Paiement supprimé avec succès !");
        } catch (error) {
          console.error('Erreur lors de la suppression du paiement:', error.message);
        }
        break;

      case '0':
        console.log("Retour au menu principal");
        break;

      default:
        console.log("Choix invalide, veuillez réessayer.");
    }
  } while (choix !== '0');
}

async function main() {
  let choix;
  do {
    choix = await mainMenu();
    switch (choix) {
      case '1':
        await handleCustomerMenu();
        break;

      case '2':
        await handleProductMenu();
        break;

      case '3':
        await handleOrderMenu();
        break;

      case '4':
        await handlePaymentMenu();
        break;

      case '0':
        console.log('Au revoir !');
        break;

      default:
        console.log('Choix invalide, veuillez réessayer.');
    }
  } while (choix !== '0');
}

main();
