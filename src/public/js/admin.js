const deleteProduct = async (btn) => {
  const proId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('article');

  // let result = await fetch(`/admin/product/${proId}`, {
  //   method: 'DELETE',
  //   headers: {
  //     'csrf-token': csrf
  //   }
  // })
  // result = await result.json()
  const { data: result } = await axios(`/admin/product/${proId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
  productElement.parentNode.removeChild(productElement);
  console.log(result);


}