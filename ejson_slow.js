Orders = new Meteor.Collection('orders');

if (Meteor.isClient) {

  Template.hello.events({
    'click button': function () {

      // Create some active queries on a single field
      let 
        orderID = Orders.findOne()._id,
        activeQueries = 30,
        queries = _.range(activeQueries).map(i => {
          return Tracker.autorun(comp => Orders.findOne(orderID, {1: 1}));
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

  // Insert large, deep document
  if (!Orders.findOne()) {
    let order = {};
    _.range(8000).forEach(i => order[i] = i);
    Orders.insert(order);
  }

}
