export function decodePaymentParams(url: string) {
  const queryString = url.split('?')[1];
  if (!queryString) return {};
  
  const params = new URLSearchParams(queryString);
  const result: Record<string, any> = {};
  
  for (const [key, value] of params) {
    try {
      const valueWithSpaces = value.replace(/\+/g, ' ');
      const decodedValue = decodeURIComponent(valueWithSpaces);
      
      if (key === 'food') {
        result[key] = parseFoodItems(decodedValue);
      } else {
        result[key] = tryParseJson(decodedValue) || decodedValue;
      }
    } catch (e) {
      result[key] = value;
    }
  }
  
  return result;
}

function parseFoodItems(foodString: string) {
  return foodString.split(',').map(item => {
    const [id, name, quantity] = item.split(':');
    return {
      id: parseInt(id),
      name: name,
      quantity: parseInt(quantity)
    };
  });
}

function tryParseJson(str : string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}