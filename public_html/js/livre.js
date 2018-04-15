/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Livre = function(book) {
    this.id = ko.observable(book.id);
    this.titre = ko.observable(book.titre);
    this.resume = ko.observable(book.resume);
  //  this.ecrit_par = ko.observable(book.ecrit_par); //reference de l'objet auteur
  //  this.categorie = new Category(book.categorie); // reference de l'obejt categorie


};

var Category = function (categorie) {
    this.id = ko.observable(categorie.id);
    this.nom = ko.observable(categorie.nom);
    this.description = ko.observable(categorie.description);
};

var ViewModel = function(livres) {
    var self = this;
    //représente la liste des catégories  
    //La fonction prend la réponse obtenue du serveur en paramètre  
    //Ici nous supposons que vous avez chargé la liste des catégories  
    //ko.utils.arrayMap itère sur la collection et pour chaque objet trouvé, elle crée une instance de categorie   
    self.livres = ko.observableArray(ko.utils.arrayMap(livres, function(book) {
        return new Livre(book);

    }));

    self.initWithEmptyLivre = function() {
        self.livre = new Livre({});
    };

    self.remove = function(livre) {
        self.livres.remove(livre);
        $.ajax({
            url: "http://localhost:8080/bibliotheque_ntdp-master/webresources/fr.unice.miage.ntdp.bibliotheque.livre/" + livre.id(),
            type: "DELETE",
            contentType: "application/json",
            headers: {
                Accept: "application/json",
                success: (function(data, status, jq) {
                    // alert(status);  
                    getData();
                })
            }
        });

    };


    self.cree = function() {
        //   console.log(ko.toJSON(self.category, null, 2));
        var cat = ko.toJSON(self.livre, null, 2);
        delete cat.id;
        console.log(cat);
        // self.categories.remove(categorie);
        $.ajax({
                url: "http://localhost:8080/bibliotheque_ntdp-master/webresources/fr.unice.miage.ntdp.bibliotheque.livre",
                type: "POST",
                data: ko.toJSON(self.livre, null, 2),
                contentType: "application/json",
                headers: {
                    Accept: "application/json"
                }
            })
            .done(function(cat, status, jq) {
                //   alert(status);

            });

    };
};


var newLivre = function() {
    var viewModel = new ViewModel();
    viewModel.initWithEmptyLivre();
    ko.applyBindings(viewModel);

};

var getDataLivre = function() {

    $.ajax({
        url: "http://localhost:8080/bibliotheque_ntdp-master/webresources/fr.unice.miage.ntdp.bibliotheque.livre",
        type: "GET",
        headers: {
            Accept: "application/json"
        },
        success: function(data, status, jq) {
            //Cette fonction indique à knockout d'appliquer les données aux éléments de la page   
            //Elle est toujours appelée quand les données sont pretes et est appelée qu'une fois   
            var cat = ko.toJSON(data, null, 2);
            console.log(cat);
            ko.applyBindings(new ViewModel(data));


        }

    });
};