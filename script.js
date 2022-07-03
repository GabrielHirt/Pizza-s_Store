let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el)=> document.querySelector(el); //função anônima
const cs = (el)=> document.querySelectorAll(el);

    //******************Listagem das pizzas*******************
pizzaJson.map((item, index) =>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; 
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.name;



    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
            e.preventDefault();
/*AULA05*/ 
            let key = e.target.closest('.pizza-item').getAttribute('data-key'); // "e.target" diz que
            // de acordo com a div clicada, que estará dentro de um link(a), ".pizza-item" irá procura a div citada
            // nos trará a ordem da pizza do JSON
            modalQt = 1;   
            modalKey = key;
             
            c('.pizzaBig img').src = pizzaJson[key].img;
            c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
            c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
            c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
            c('.pizzaInfo--size.selected').classList.remove('selected');
            cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
                if(sizeIndex == 2) {
                    size.classList.add('selected');
                }
                size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
            });

            c('.pizzaInfo--qt').innerHTML = modalQt;

            c('.pizzaWindowArea').style.opacity = 0;
            c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{ // o código, após o click, ao chegar qaqui, aguardará 200s para 
            //executar a troca de opacyty de 0 para 1, fará isso dentro de 1s, mudando a 
            //opacity de 0 até 1 con o efeito por meio do style, usando o efeito
            //"transition: all ease 1s" na div .pizzaWindowArea;
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });


    c('.pizza-area').append(pizzaItem); 
    //para que o map não substitua as inforções de cada indice do objeto,
    // no momento em que o indice almenta e muda o item, 
    // utilizamos o ".append" e não o ".innerHTML", assim acrescentamos
    //e não substituímos
});


//********************Eventos do moedal*****************************
//Solução do Bonieky para fechar o modal clicando fora dele
const withOnOutside = (fn) => (event) => {
    if (event.target === event.currentTarget) {
        fn(event);
    }
};
let modal = c(".pizzaWindowArea");
modal.addEventListener("click", withOnOutside(() => closeModal()));

//Fechar o model clicando no botao modo webpage
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(function(){
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
};

cs(".pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton").forEach((item)=>{
    item.addEventListener("click", closeModal);
});

//Add produto ou retirar
c('.pizzaInfo--qtmais').addEventListener("click", ()=>{
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt
});
c('.pizzaInfo--qtmenos').addEventListener("click", ()=>{
    if(modalQt > 1){
        modalQt--
        c('.pizzaInfo--qt').innerHTML = modalQt
    }
});

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size //Criando identficação única para um tipo de pizza

    let key = cart.findIndex((item)=>item.identifier === identifier);
    console.log(key);

    if(key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }

    updateCart();

    closeModal();
});


c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('aside').style.left = '0';
    } else {
        alert('Não há itens a serem exibidos no momento!')
    }
});


    c('.menu-closer').addEventListener('click', ()=>{
        c('aside').style.left = '100vw';
    });


    function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;



        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;



            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){ // Dará um nome de acordo com o índice
                case 0:
                    pizzaSizeName = 'Pequena';
                    break;
                case 1:
                    pizzaSizeName = 'Média';
                    break;
                case 2:
                    pizzaSizeName = 'Grande';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt >1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `$ ${total.toFixed(2)}`;

        

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}



