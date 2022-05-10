class Vendingmachine{
    constructor() {
        this.btnPut = document.querySelector('.btn-put');
        this.btnGet = document.querySelector('.btn-get');
        this.btnReturn = document.querySelector('.btn-return');
        this.balance = document.querySelector('.txt-balance');
        this.myMoney = document.querySelector('.txt-mymoney');
        this.listItem = document.querySelector('.list-item');
        this.inputCost = document.querySelector('.input-put');
        this.stagedList = document.querySelector('.container-get .list-item-staged');
        this.gotList = document.querySelector('.container-myitems .list-item-staged');
        this.txtTotal = document.querySelector('.txt-total');
    }

    setup(){
        this.bindEvents();
    }

    // 선택한 아이템 창
    stagedItemGenerator(target) {
        const item = document.createElement('li');
        item.dataset.item = target.dataset.item;
        item.dataset.price = target.dataset.price;

        item.innerHTML =  `
            <img src="./${target.dataset.img}" alt="" class="img-item">
            <strong class="txt-item">${item.dataset.item}</strong>
            <span class="num-counter">1</span>
        `

        this.stagedList.appendChild(item);
    }

    bindEvents() {
        // 입금 클릭시
        this.btnPut.addEventListener('click', () => {
            const inputCost = parseInt(this.inputCost.value);
            const myMoney = parseInt(this.myMoney.innerText.replace(',', ''));
            const balance = parseInt(this.balance.innerText.replace(',', ''));

            if(inputCost){
                if(inputCost <= myMoney){
                    this.myMoney.innerText = new Intl.NumberFormat().format(myMoney - inputCost) + ' 원';
                    this.balance.innerText = new Intl.NumberFormat().format((balance ? balance : 0) + inputCost) + ' 원';
                    
                    this.inputCost.value = null;
                }
                else{
                    alert('소지금이 부족합니다.');

                    this.inputCost.value = null;
                }
            }
        });

        // 거스름돈 반환 클릭시
        this.btnReturn.addEventListener('click', () =>{
            const myMoney = parseInt(this.myMoney.innerText.replace(',', ''));
            const balance = parseInt(this.balance.innerText.replace(',', ''));
            if(balance){
               this.myMoney.innerText = new Intl.NumberFormat().format(myMoney + balance) + " 원";
               this.balance.innerText = 0 + " 원";
            }
            
        });

        // 아이템 클릭시
        this.listItem.addEventListener('click', (e) => {
            const balance = parseInt(this.balance.innerText.replace(',', ''));
            const targetElBtn = e.target.querySelector('.btn-item');
            let isStaged = false; // 이미 선택했는지
            const item = document.createElement('li');

            if(e.target.tagName === "LI"){
                const targetElPrice = parseInt(targetElBtn.dataset.price);
                if(balance >= targetElPrice){
                    this.balance.innerText = new Intl.NumberFormat().format(balance - targetElPrice) + ' 원';

                    // 담은 상품이 하나 이상일 경우
                    if(this.stagedList.querySelectorAll('li').length > 0){
                        this.stagedList.querySelectorAll('li').forEach((i) => {
                            // 기존에 담았던 상품일 경우
                            if(i.dataset.item === targetElBtn.dataset.item){
                                i.querySelector('.num-counter').innerText++;
                                isStaged= true;
                                return;
                            }
                        });
                        if(!isStaged){ // 처음 선택했을 때
                            this.stagedItemGenerator(targetElBtn);
                        }
                    }
                    else{ // 담은 상품이 하나도 없다면
                        this.stagedItemGenerator(targetElBtn);
                    }
                    targetElBtn.dataset.count--;
                    if(targetElBtn.dataset.count == 0){ // 상품이 소진됐을 때
                        e.target.classList.add('sold-out');
                    }
                }
                else{
                    alert("잔액이 부족합니다.");
                }
            }
        })

        // 획득 클릭시
        this.btnGet.addEventListener('click', () => {
            let totalPrice = 0;
            let isGot = false;
            this.stagedList.querySelectorAll('li').forEach((itemStaged) => {
                this.gotList.querySelectorAll('li').forEach((itemGot) => {
                    if(itemStaged.dataset.item === itemGot.dataset.item){
                        let itemGotCount = itemGot.querySelector('.num-counter');
                        itemGotCount.innerText = parseInt(itemGotCount.innerText) + parseInt(itemStaged.querySelector('.num-counter').innerText);
                        this.stagedList.removeChild(itemStaged);
                        isGot = true;
                        return;
                    }
                });
                if(!isGot){
                    this.gotList.appendChild(itemStaged);
                }
            });

            // 총 금액 계산
            this.gotList.querySelectorAll('li').forEach((item) => {
                totalPrice += parseInt(item.dataset.price) * parseInt(item.querySelector('.num-counter').innerText);
            });
            this.txtTotal.innerText = `총 금액 : ${new Intl.NumberFormat().format(totalPrice)}`;
        });
    }
}

export default Vendingmachine;