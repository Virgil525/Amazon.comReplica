import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },

  {
    id: '2',
    deliveryDays: 3,
    priceCents:499
  },

  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];

export function getDeliveryOption(deliveryOptionId){
  let option;
  deliveryOptions.forEach((deliveryOption)=>{
    if(deliveryOption.id === deliveryOptionId){
      option = deliveryOption;
    }
  });
  return option;
}

export function calculateDeliveryDate(deliveryOption){
  const today = dayjs();
  let deliveryDays = deliveryOption.deliveryDays;
  let deliveryDate = today;
  while (deliveryDays > 0){
    if(!isWeekend(deliveryDate)){
      deliveryDays--;
    }
    deliveryDate = deliveryDate.add(1,'days');
  }
  while(isWeekend(deliveryDate))
  {
    deliveryDate = deliveryDate.add(1,'days');
  }
  return deliveryDate.format('dddd, MMMM D');
}

function isWeekend(date) {
  const dayOfTheWeek = date.format('dddd');
  if (dayOfTheWeek === 'Saturday' || dayOfTheWeek === 'Sunday') {
    console.log('is weekend');
    return true;
  }
  return false;
}