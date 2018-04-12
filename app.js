var inquirer = require('inquirer')
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
})

function start() {
connection.query("Select * FROM Products", function (err , res){
    if (err) throw err
    console.log('------------- Welcome to Bamazon! -------------')
    console.log('--------------------------------------------------------------------------------------------------')

    //loop thru to see the choices
    for (var i = 0; i <res.length; i++){
    console.log("ID: " + res[i].id  + "\nProduct: " + res[i].product_name  + "\nDepartment: " + res[i].department_name  + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity);
    console.log('--------------------------------------------------------------------------------------------------')    
    }

    
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'What is the ID of the product you would like?',
            validate: function(value){
                if (isNaN(value) == false && parseInt(value)<= res.length && parseInt(value)>0){
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many would you like?',
            validate: function(value) {
                if (isNaN(value)){
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    ])
    .then(function(answer){
        var toBuy = (answer.id)-1
        var howMany = (parseInt(answer.stock_quantity))
        var total = parseFloat(((res[toBuy].price)* howMany).toFixed(2))

        if(res[toBuy].stock_quantity >= howMany){
            connection.query('UPDATE products SET ? WHERE ?', [
                {
                    stock_quantity: (res[toBuy].stock_quantity - toBuy)
                },
                {
                    item: answer.id
                }
            ],
             console.log("Your total is $" + total.toFixed(2) + ". ")
            )

            connection.query('SELECT * FROM stock_quantity', function(err, stockRes){
                if (err) throw err
                var index;
                for(var i = 0; i < stockRes.length; i++){
                    if(stockRes[i].stock_quantity === res[toBuy].stock_quantity){
                        index = 1
                    }
                }

            
            connection.query("UPDATE stock_quantity SET ? WHERE ?", [
                {
                    stock_quantity: stockRes[i].stock_quantity - total
                },
                {
                    stock_quantity: res[toBuy].stock_quantity
                }
            ], 
                console.log('Updated Quantity')
            )
            })
        } else {
            console.log("No more in stock")
        }
        showProduct()
    })
})
}

function showProduct() {
    inquirer.prompt ([{
        type: 'confirm',
        name: 'reply',
        message: 'Would you like another item?',
    }]).then(function(ans){
        if(ans.reply){
            start();
        }
        else {
            console.log("Goodbye!")
        }
    })
} 
start();


