Orders = new Meteor.Collection('orders');

if (Meteor.isClient) {

  Template.hello.events({
    'click button': function () {

      // Create some active queries on a single field
      let 
        orderID = Orders.findOne()._id,
        activeQueries = 30,
        queries = _.range(activeQueries).map(i => {
          return Tracker.autorun(comp => Orders.findOne(orderID, {
            fields: {1: 1}
          }));
        });

      // Perform database update
      let tic = performance.now();
      Orders.update(orderID, {
        $set: {
          order_number: _.random(1000).toString()
        }
      });
      let toc = performance.now();
      console.log(`The update took ${toc-tic} milliseconds with ${activeQueries} queries active.`);

      // Clean up active queries
      queries.forEach(query => query.stop());

    }
  });
}


if (Meteor.isServer) {

  // Randomly generate a deep tree
  let makeTree = function(width, depth, decay) {
    if (depth === 0)
      return Math.random();

    let tree = {};
    _.range(width).forEach((i) => {
      let newWidth = (width-1) * (decay < Math.random()),
          newDepth = (depth-1) * (decay < Math.random());
      tree[i] = makeTree(newWidth, newDepth,  decay);
    });

    return tree;
  };

  // Insert large document
  if (!Orders.findOne()) {
    let order = {};
    while (EJSON.stringify(order).length < 1000000)
      order = makeTree(25, 7, 0.6);
    Orders.insert(order);
  }

}
