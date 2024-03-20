class Graph{
    constructor(canvasName,years = ['2019', '2020', '2021', '2022', '2023']){
        this.ctx = document.getElementById(canvasName).getContext('2d');
        this.labels = years;
        this.dataA = []; //필기
        this.dataB = []; //실기
        this.dataTotal = [];
        this.color = {
            a : {
                default : '',
                dark : '',
                r : '',
                g : '',
                b : '',
                gradient : ''
            },
            b : {
                default : '',
                dark : '',
                r : '',
                g : '',
                b : '',
                gradient : ''
            },
        }
        this.yMax = 100;
        this.chart = null;
        this.options = null;
        this.datalabelSet = null;
        this.graphA = null;
        this.graphB = null;
    }
    getcolor(){
        //color값 가지고오기
        let mainCl = window.getComputedStyle(document.querySelector('#ldMain .sec-intro h1'));
        let subCl = window.getComputedStyle(document.querySelector('#ldMain .sec-last'));

        //rgb값 변수로 분리
        function divideRgb(rgb, obj){
            let [r,g,b] = rgb.match(/\d+/g);
            return [r,g,b]
        }
        mainCl = divideRgb(mainCl.color, this.color.a);
        subCl = divideRgb(subCl.backgroundColor, this.color.b);

        //객체에 입력
        this.color = {
            a : {
                r: parseInt(mainCl[0]),
                g: parseInt(mainCl[1]),
                b: parseInt(mainCl[2])
            },
            b: {
                r: parseInt(subCl[0]),
                g: parseInt(subCl[1]),
                b: parseInt(subCl[2])
            }
        };

        //Hex코드로 변경
        function rgbToHex(cl) {
            const amount = 0.3;
            // 각각의 구성 요소를 16진수로 변환
            let hexR = Number(cl.r).toString(16).padStart(2, '0');
            let hexG = Number(cl.g).toString(16).padStart(2, '0');
            let hexB = Number(cl.b).toString(16).padStart(2, '0');
            let darkR = Math.round(cl.r * amount).toString(16).padStart(2,'0');
            let darkG = Math.round(cl.g * amount).toString(16).padStart(2,'0');
            let darkB = Math.round(cl.b * amount).toString(16).padStart(2,'0');
            //변수에 입력
            cl.default = "#" + hexR + hexG + hexB;
            cl.dark = "#" + darkR + darkG + darkB;
        }
        rgbToHex(this.color.a);
        rgbToHex(this.color.b);

        // 그라데이션 구하기
        const ctx = this.ctx;
        function createGradient(obj){
            let gradient = ctx.createLinearGradient(0, 400, 0, 800);

            gradient.addColorStop(0, obj.default);
            gradient.addColorStop(1, obj.dark);

            obj.gradient = gradient;
        }
        createGradient(this.color.a);
        createGradient(this.color.b);
    }
    set(){
        this.getcolor();
        this.options = {
            // hover:{
            //     mode: null
            // },
            scales: {
                y: {
                    beginAtZero: true,
                    max: this.yMax
                },
                x: {
                    ticks : {
                        font: {
                            size: 24,
                            weight : 800,
                            color: '#232323'
                        }
                    },
                },
            },
            // layout:{
            //     padding: 20
            // },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    align: 'center',
                    labels:{
                        boxWidth: 16,
                        boxHeight:16,
                        color: '#000000',
                        padding: 24,
                        font: {
                            size: 16,
                            weight: 400,
                        }
                    }
                },
                tooltip: {  
                    enabled: false, // 툴팁 비활성화
                    mode: 'index', // 호버시에 툴팁이 표시되지 않도록 설정
                    intersect: false
                },
            }
        }
        this.datalabelSet = {
            anchor: 'end', 
            align: 'top', // 세로 정렬을 위로 설정
            color: '#232323',
            font: {
                weight: 600,
                size: 16,                
            },
            offset: 0, // 세로 위치를 위로 10px 만큼 이동
            formatter: function(value) {
                return value + '%'; // 각 데이터셋의 값으로 라벨 설정
            }
        }
        this.graphA = {
            label: '필기 합격률 (%)',
            data: this.dataA,
            backgroundColor: this.color.a.gradient,
            datalabels: this.datalabelSet,
            animation:{
                duration: 2000,
                easing : 'easeInOutCubic'
            },
            borderRadius: 8,
            barPercentage: 0.85 // 막대 간의 간격 조절 (0.8은 막대의 너비가 축의 80%를 차지하도록 함)
        }
        this.graphB = {
            label: '실기 합격률 (%)',
            data: this.dataB,
            backgroundColor: this.color.b.gradient,
            datalabels: this.datalabelSet,
            animation:{
                duration: 2000,
                delay : 200,
                easing : 'easeInOutCubic'
            },
            borderRadius: 8,
            barPercentage: 0.85 // 막대 간의 간격 조절 (0.8은 막대의 너비가 축의 80%를 차지하도록 함)
        }
        Chart.defaults.font.family = 'Pretendard';
    }
    draw(){
        this.set();
        this.chart = new Chart(this.ctx,{
            type: 'bar',
            data : {
                labels : this.labels,
                datasets : [this.graphA, this.graphB]
            },
            options : this.options,
            plugins: [ChartDataLabels],
        });
    }
    reload(){
        this.chart.reset();
        this.chart.update({
            duration: 800,
            easing: 'easeOutBounce'
        });
    }
}

const chart1 = new Graph('chart1');
chart1.dataA = [29.7, 28.3, 22.1, 22.3, 22.3];
chart1.dataB = [40.8, 16.9, 29.3, 39.5, 37.1];
chart1.dataTotal = chart1.dataA.concat(chart1.dataB);
chart1.yMax = Math.floor(Math.max(...chart1.dataTotal)+10);
chart1.draw();

const chart2 = new Graph('chart2');
chart2.dataA = [18,25,18.4,21.6,18.7];
chart2.dataB = [34.3,27.4,27.3,24.1,50.6];
chart2.dataTotal = chart2.dataA.concat(chart2.dataB);
chart2.yMax = Math.round((Math.max(...chart2.dataTotal)+10)/10)*10;
chart2.draw();

const graphIo = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            let now = entry.target.getAttribute('id');
            if (now =='chart1'){
                chart1.reload();
            }
            else if(now =='chart2'){
                chart2.reload();
            }
        }
    });
});

let targetGraph = document.querySelectorAll('.sec-passingRate .chart');
targetGraph.forEach((graph)=> graphIo.observe(graph));