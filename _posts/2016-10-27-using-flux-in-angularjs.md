These are guidelines for refactoring parts of your Angular app to use Flux. They are not meant to make your app completely follow
Flux/Redux, just to help you refactor one component or page in a pragmatic way.

## Action creators
### Async action creators
1. Should end in the word `Async`
2. Should return a promise
3. Should dispatch an action to mutate the state to indicate a request is in progress (eg, by setting a `ui.isLoading` prop to `true`)
as soon as the request is sent.
4. Should dispatch an action to mutate the state to indicate that a request has completed once the request is finished (successfully or
not).
5. Should not attempt to handle errors. Instead, the code that calls the action creator should handle the error by catching errors from
the returned promise.

The error handling guidelines can be altered for your app if you want to get more ambitions by moving more state into the store. However,
for a first-pass refactoring, errors can be a good thing to keep out of the store and keep being handled in "non-flux" code.

# Dealing with third-party components
