const e = require('express');
const express = require('express');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const searchMethodArray = ['線形探索','二分木探索'];

let node =
    {
        number: -1,
        leftArray: [],
        rightArray:[]
    };

app.get('/', (req, res) => 
{
    res.locals.selectedNum = 0;
    res.render('index.ejs',{result:0, searchMethodArray: searchMethodArray});
});

app.get('/index', (req, res) => 
{
    
    res.render('index.ejs',{result:0, searchMethodArray: searchMethodArray});
});

app.post('/index', (req,res) =>
{
    const searchselect = req.body.searchselect;
    let strArray = [];

    strArray.push(req.body.num1);
    strArray.push(req.body.num2);
    strArray.push(req.body.num3);
    strArray.push(req.body.num4);
    strArray.push(req.body.num5);

    //Number型への変換
    let numberArray = [];
    strArray.forEach(numStr => {
        numberArray.push(Number(numStr));
    });

    let searchNumber = Number(req.body.searchNumber);    

    switch (searchselect)
    {
        case searchMethodArray[0]:
            //Linear search

            node.number = linearSearch(numberArray,searchNumber);
            res.locals.selectedNum = 0;
            break;
        case searchMethodArray[1]:
            //Binary search

            node = binarySearch(numberArray,searchNumber);
            res.locals.selectedNum = 1;
            break;
        default:
            node.number = -1;
            break;
    }
    res.render('index.ejs',{result: node, searchMethodArray: searchMethodArray});

});

const linearSearch = ((numArray,searchNum) =>
{
    let result = -1;
    //番兵作成
    numArray.push(searchNum);
    //console.log(numArray);
    for(let i = 0;i < numArray.length; i++)
    {
        //console.log("i:" + i + ", value:" + numArray[i]);
        if(numArray[i] == searchNum && i != numArray.length - 1)
        {
            result = i + 1;
        }
    }
    
    return result;
});

const binarySearch = ((numArray,searchNum) =>
{
    //ソート
    numArray = bubbleSort(numArray);

    let minNum = 0;
    let maxNum = numArray.length;
    
    let leftArray = [];
    let rightArray = [];

    let resultNode = node;
    while(true)
    {
        let middleNum = Math.floor((minNum + maxNum) / 2);
        if(numArray[middleNum] == searchNum)
        {
            for(let i = 0 ; i < middleNum; i++)
            {
                leftArray.push(numArray[i]);
            }
            for(let i = middleNum + 1 ; i < numArray.length; i++)
            {
                rightArray.push(numArray[i]);
            }

            resultNode =
            {
                number:undefined,
                leftArray:leftArray,
                rightArray:rightArray
            };
            
            return resultNode;
        }
        else if (numArray[middleNum] > searchNum)
        {
            //小さい場合は木の左側へ
            if(maxNum == middleNum)
            {
                //not found : 404
                
                break;
            }
            maxNum = middleNum;
            
        }
        else if (numArray[middleNum] < searchNum)
        {
            if(minNum == middleNum)
            {
                //not found : 404
                break;
            }
            minNum = middleNum;
        }
        else
        {
            //ありえない
            return null;
        }
        
    }

    resultNode =
            {
                number:-1,
                leftArray:[],
                rightArray:[]
            };
    return resultNode;
    
});
const bubbleSort = ((numberArray) =>
{
    for(let laps = 0; laps < numberArray.length; laps++)
    {
        for(let i = numberArray.length - 1; i > laps; i--)
        {    
            if(numberArray[i] < numberArray[i - 1])
            {
                let tmp = numberArray[i];
                numberArray[i] = numberArray[i - 1];
                numberArray[i - 1] = tmp;
            }
        }
    }
    return numberArray;
});


app.listen(3000);