const deleteProduct = async(btn) => {
  const proId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const result = await fetch(`/admin/product/${proId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
  console.log(result);
  

}