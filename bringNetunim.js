let datanetunimKlaliX=[];
const excludedKupaNames = ['ניהול אישי', 'IRA'];
const excludedOchlosiya = ['עובדי סקטור מסויים', 'עובדי מפעל/גוף מסויים'];
const excludedMozar = ['מטרה אחרת'];
const excludedMas = ['מבטיח תשואה'];
const mozkoch = [
    'קרנות השתלמות', 'תגמולים ואישית לפיצויים', 'קופת גמל להשקעה',
    "קופת גמל להשקעה - חסכון לילד", "מרכזית לפיצויים"
];
const hishtalmot=[
    "כללי",
    "עוקב מדד s&p 500",
    "מניות",
    "אשראי ואג\"ח",
    "אשראי ואג\"ח עם מניות",
    "כספי (שקלי)",
    "עוקב מדדים - גמיש",
    "אג\"ח ממשלות",
    "הלכה יהודית",
    "משולב סחיר",
    "עוקב מדדי אג\"ח",
    "עוקב מדדי מניות",
    "אג\"ח סחיר",
    "מניות סחיר"
    
];
const gemel=[
    "מניות",
    "50-60",
    "עוקב מדד s&p 500",
    "עד 50",  
    "60 ומעלה",
    "אשראי ואג\"ח",
    "כספי (שקלי)",
    "משולב סחיר",
    "עוקב מדדים - גמיש",
    "אג\"ח ממשלות",
    "הלכה יהודית",
    "מניות סחיר",
    "עוקב מדדי אג\"ח",
    "עוקב מדדי מניות",
    "אג\"ח סחיר"
    ];
const layeled=['סיכון מועט','סיכון בינוני','סיכון מוגבר','הלכה יהודית']

const bituach=['הראל פנסיה וגמל','כלל פנסיה וגמל',
    'מגדל מקפת קרנות פנסיה וקופות גמל','מנורה מבטחים פנסיה וגמל',
    'הפניקס פנסיה וגמל'
  ]
  const bateyhashkaot=['אינפיניטי השתלמות, גמל ופנסיה','אלטשולר שחם גמל ופנסיה',
    'אנליסט קופות גמל','ילין לפידות ניהול קופות גמל','מור גמל ופנסיה'
    ,'מיטב גמל ופנסיה','סלייס גמל'
  ]


  window.onload = async function() {  
    fetchAllNetunim();
    //maslulim();
  }
  async function fetchAllNetunim(){
    await fetchkupotKlali();
    await fetchtsuaaHodshi();
    await fetchNechasim();
    console.log(datanetunimKlaliX);
 }




async function fetchkupotKlali() {
    
  fetch('kupotKlali.xml')
  .then(response => response.text()) // מקבל את תוכן הקובץ כטקסט
  .then(xmlString => {
      const parser = new DOMParser(); 
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");
      const rows = xmlDoc.getElementsByTagName("Row");
      let colllen;
      let coll = [];
      for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const mozar = row.getElementsByTagName("SUG_KUPA")[0]?.textContent ||  '';
          const shemkupa = row.getElementsByTagName("SHM_KUPA")[0]?.textContent || '';
          const yitratnehasim = row.getElementsByTagName("YITRAT_NCHASIM_LSOF_TKUFA")[0]?.textContent || '';
          const divuach = row.getElementsByTagName("MATZAV_DIVUACH")[0]?.textContent ||  '';
          const ochlosiyayaad = row.getElementsByTagName("UCHLUSIYAT_YAAD")[0]?.textContent ||  '';
          const mhkupa = row.getElementsByTagName("ID")[0]?.textContent ||  '';
          const mas = row.getElementsByTagName("HITMAHUT_MISHNIT")[0]?.textContent ||  '';
          const tesuam = row.getElementsByTagName("TSUA_MITZTABERET_LETKUFA")[0]?.textContent ||  '';
          const tesuam36 = row.getElementsByTagName("TSUA_MITZTABERET_36_HODASHIM")[0]?.textContent ||  '';
          const tesuam60 = row.getElementsByTagName("TSUA_MITZTABERET_60_HODASHIM")[0]?.textContent ||  '';
          const tarsiyum = row.getElementsByTagName("TAARICH_SIUM_PEILUT")[0]?.textContent ||  '';
          const menahelet = row.getElementsByTagName("SHM_HEVRA_MENAHELET")[0]?.textContent ||  '';
          const stiya36 = row.getElementsByTagName("STIAT_TEKEN_36_HODASHIM")[0]?.textContent ||  '';  
          const stiya60 = row.getElementsByTagName("STIAT_TEKEN_60_HODASHIM")[0]?.textContent ||  '';  

          if (
            divuach === "דווח" &&
            !excludedKupaNames.some(name => shemkupa.includes(name)) &&
            !excludedOchlosiya.includes(ochlosiyayaad) &&
            !excludedMozar.includes(mozar) &&
            !excludedMas.includes(mas) &&
            !tarsiyum &&
            Number(yitratnehasim) > 0
        ) {
          datanetunimKlaliX.push({
            mh: mhkupa, 
            shemkupa: shemkupa, 
            mozar: mozar, 
            tesuam: Number(tesuam), 
            mas: mas, 
            yitra: yitratnehasim, 
            tesuam36: Number(tesuam36), 
            tesuam60: Number(tesuam60),
            menahelet: menahelet,
            stiya36: stiya36,
            stiya60: stiya60    
          });

          
      }
      
      
      }
      
      
    
  })
  .catch(error => {
      console.error('Error:', error);
      return [];  // מחזירים מערך ריק במקרה של שגיאה
  });
}



async function fetchtsuaaHodshi() {
    
    fetch('kupotHodshAharon.xml')
        .then(response => response.text())
        .then(xmlString => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "application/xml");
            const rows = xmlDoc.getElementsByTagName("Row");
    
            // אובייקט לאחסון את התשואות המצטברות
            const idKupaMap = {};
    
            // 1. עבור כל איבר ב-datanetunimKlali
            datanetunimKlaliX.forEach(item => {
                const idKupa = item.mh;  
    
                // 2. סינון השורות לפי ה-ID_KUPA הנוכחי
                const rowsForIdKupa = Array.from(rows).filter(row => {
                    return row.getElementsByTagName("ID_KUPA")[0].textContent === idKupa;
                });
    
                var lastRow = rowsForIdKupa[rowsForIdKupa.length - 1];
                var tsuaNominaliBfoal = lastRow.getElementsByTagName("TSUA_NOMINALI_BFOAL")[0].textContent;


                let cumulativeReturn = 1;
                let startOfYear = false;
    
                rowsForIdKupa.forEach(row => {
                    const tsuaNominaliBfoal = row.getElementsByTagName("TSUA_NOMINALI_BFOAL")[0]?.textContent;
                    const tkfDivuach = row.getElementsByTagName("TKF_DIVUACH")[0]?.textContent;
    
                    if (tsuaNominaliBfoal && tkfDivuach) {
                        const year = tkfDivuach.substring(0, 4);
                        const month = tkfDivuach.substring(4, 6);
    
                        // אם מדובר בתחילת שנה (ינואר)
                        if (month === "01" && !startOfYear) {
                            startOfYear = true;
                            cumulativeReturn = 1 + (parseFloat(tsuaNominaliBfoal) / 100);
                        } 
                        // אם לא בתחילת שנה, מחשבים את הצבירה
                        else if (startOfYear) {
                            cumulativeReturn *= 1 + (parseFloat(tsuaNominaliBfoal) / 100);
                        }
                    }
                });
    
               
                if (startOfYear) {
                    idKupaMap[idKupa] = cumulativeReturn;
                }
                const target = datanetunimKlaliX.find(itema => itema.mh === idKupa);
                target.tusaAharona = Number(tsuaNominaliBfoal);
                target.tesuaMitchilatshana = ((cumulativeReturn - 1) * 100).toFixed(2);
            });
   

           
            
        })
        .catch(error => console.error('Error parsing XML:', error));
    
  }

  async function fetchNechasim() {
    fetch('nechasim.xml')
      .then(response => response.text()) 
      .then(nechsimstring => {
        const parser = new DOMParser(); 
        const xmlNechasim = parser.parseFromString(nechsimstring, "application/xml"); 
        const rows = xmlNechasim.getElementsByTagName("Row");
        let shiurMenayut=0;var ramatsikona;
        datanetunimKlaliX.forEach(item => {
            const idKupa = item.mh; 
            
            
            for (const row of rows) {
                const mhkupa1 = row.querySelector("ID_KUPA")?.textContent || '';
                const sugneches = row.querySelector("ID_SUG_NECHES")?.textContent || '';
                const schumsugneches = row.querySelector("SCHUM_SUG_NECHES")?.textContent || '';
                const ahuzsugneches = row.querySelector("ACHUZ_SUG_NECHES")?.textContent || '';
                const shemsugneches = row.querySelector("SHM_SUG_NECHES")?.textContent || '';
                
                if (mhkupa1 && Number(mhkupa1) === Number(idKupa)) {
                    const target = datanetunimKlaliX.find(item => item.mh === idKupa);
            
                    if (target) {
                        const schumkvutzaKey = `kvutzaSchum${sugneches}`;
                        const ahuzkvutzaKey = `kvutzaAhuz${sugneches}`;
                        const sugkvutzaKey = `kvutzaSug${sugneches}`;
            
                        target[schumkvutzaKey] = schumsugneches;
                        target[ahuzkvutzaKey] = ahuzsugneches;
                        target[sugkvutzaKey] = shemsugneches;
                        
            
                        if (Number(sugneches) === 4751) {
                            const shiurMenayut = Number(ahuzsugneches);
                            target.ramatsikon = calculateRiskLevel(shiurMenayut);
                        }
                    }
                }
            }
            

        alert("הסתיימה הטעינה");

        });
       

      })
        .catch(error => console.error('Error:', error));
  }

  function calculateRiskLevel(shiurMenayut) {
    if (shiurMenayut < 30) return 'נמוכה';
    if (shiurMenayut >= 30 && shiurMenayut < 55) return 'בינונית';
    if (shiurMenayut >= 55 && shiurMenayut < 75) return 'בינונית-גבוה';
    return 'גבוהה';
}

  
async function makejason() {
    

        // המרת הנתונים לפורמט JSON
        const json = JSON.stringify(datanetunimKlaliX, null, 2);

        // יצירת הקובץ
        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'dataJason.json';
        link.click();

        console.log("הקובץ נוצר בהצלחה!");
    
}


    async function fetchdataJason() {
        try {
            const response = await fetch('dataJason.json'); // שליפת הקובץ
            if (!response.ok) {
                throw new Error(`שגיאה: ${response.status} ${response.statusText}`);
            }
    
            const data = await response.json(); 
            return data; 
        } catch (error) {
            console.error('שגיאה בשליפת הנתונים:', error);
        }
    }
    
        
            
         
        
      
        
       
        
 



  
