document.addEventListener('DOMContentLoaded',function(){
  try{
    let form = document.forms['myForm'];

    if(form){
      form.addEventListener('submit',(e)=>{
        e.preventDefault();
        
        let inputs = getData();
        let calculation = new Calculation(inputs);
        if(calculation.validate()){
          return;
        }

        let mortgage = calculation.calculate();
        document.querySelector('.completed .mortgage_mon span').textContent=mortgage.mortgage_mon; 
        document.querySelector('.completed .mortgage-tot span').textContent=mortgage.mortgage_tot; 

        document.querySelector('.empty').classList.add('hidden');
        document.querySelector('.completed').classList.remove('hidden');
      })

      document.querySelector('.clear').addEventListener('click',()=>{
        document.querySelector('.amount input').value = '';
        document.querySelector('.time input').value = '';
        document.querySelector('.rate input').value = '';
        document.querySelector('.type input:checked').checked = false;

        document.querySelector('.empty').classList.remove('hidden');
        document.querySelector('.completed').classList.add('hidden');
      });
    }

    function getData(){
      return [
        {
          name: 'amount',
          value : form.querySelector('.amount input').value,
          error : form.querySelector('.amount .err'),
          element : form.querySelector('.amount div')
        },
        {
          name: 'time',
          value : form.querySelector('.time input').value,
          error : form.querySelector('.time .err'),
          element : form.querySelector('.time div')
        },
        {
          name: 'rate',
          value : form.querySelector('.rate input').value,
          error : form.querySelector('.rate .err'),
          element : form.querySelector('.rate div')
        },
        {
          name: 'type',
          value : form.querySelector('.type input:checked'),
          error : form.querySelector('.type .err'),
          element : form.querySelector('.type div')
        }
      ]
    }
  }catch(err){
    console.error(err);
  }
});

class Calculation{
  constructor(data) {
    this.data = data;
    this.error = false;
    this.p = 0;
    this.t = 0;
    this.r = 0;
    this.mort_mon_dec = 0;
    this.mort_mon = 0;
    this.mort_tot = 0;
  }

  validate(){
    this.data.forEach(input => {
      if(!input.value){
        input.error.classList.remove('hidden');
        input.error.classList.add('block');
        input.element.classList.add('error');
        this.error = true;
        return;
      }
      input.error.classList.add('hidden');
      input.error.classList.remove('block');
      input.element.classList.remove('error');
    });
    return this.error;
  }

  calculate(){
    this.data.forEach(input => {
      if(input.name === 'amount') {this.p = input.value};
      if(input.name === 'time') {this.t = input.value*12};
      if(input.name === 'rate') {this.r = (input.value/100)/12};
    });

    this.mort_mon = (this.p*this.r*(Math.pow(1+this.r,this.t)))/(Math.pow(1+this.r,this.t)-1);
    this.mort_mon_dec = this.mort_mon.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    this.mort_tot = this.mort_mon*12*25;
    this.mort_tot = this.mort_tot.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return {
      mortgage_mon: this.mort_mon_dec, 
      mortgage_tot: this.mort_tot
    };
  }
}