import withWorker from './gameWithWorker'
// import withoutWorker from './gameWithoutWorker'

withWorker().then((init: any) => {
  init()
})
