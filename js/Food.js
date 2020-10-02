class Food {
    constructor() {
        this.foodStock = 0;
        this.lastFed;
        this.milkImage = loadImage("images/Milk.png");
    }

    bedroom() {
        background(bedroomImg, 550, 500);
    }
    garden() {
        background(gardenImg, 550, 500);
    }
    washroom() {
        background(washroomImg, 550, 500);
    }
    //read food stock from database
    getFoodStock() {
        return this.foodStock;
    }

    //update the Food Stock to database
    updateFoodStock(foodStock) {
        this.foodStock = foodStock;
    }

    //reduce number of milk bottles
    deductFood() {
        if (this.foodStock > 0) {
            this.foodStock = this.foodStock - 1
        }
    }

    getFedTime(lastFed) {
        this.lastFed = lastFed;
    }
    display() {
        var x = 80;
        var y = 100;
        imageMode(CENTER);
        image(this.milkImage, 320, 220, 70, 70);

        if (this.foodStock !== 0) {
            for (var i = 0; i < this.foodStock; i++) {
                if (i % 10 === 0) {
                    x = 80;
                    y = y + 50;
                }
                image(this.milkImage, x, y, 50, 50);
                x = x + 30;
            }
        }
    }

}