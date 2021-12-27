// eslint-disable-next-line func-names
export default async function ({ redirect, route }) {
  try {
    const pools = ['ETH', 'BNB'];
    const currentPool = route.params.id;
    if (!pools.includes(currentPool)) {
      console.error('Unknown pool: ', currentPool);
      redirect('/mining');
    }
    return true;
  } catch (e) {
    console.error('Error in middleware of mining: ', e);
    return redirect('/mining');
  }
}
