<script>
  import { compareAsc, format } from "date-fns";

  export let user;
  export let message;
  export let timeStamp;
  export let serverMessage = false;
</script>

<style>
  div {
    -webkit-animation: fadein 0.3s; /* Safari, Chrome and Opera > 12.1 */
    -moz-animation: fadein 0.3s; /* Firefox < 16 */
  }
  div.server {
    background: rgba(246, 71, 71, 0.5) !important;
  }

  div.server,
  span {
    padding-right: 1rem;
  }

  span.user {
    font-weight: 700 !important;
  }
  span:last-of-type {
    padding-right: 0;
  }

  time {
    float: right;
  }

  @media (max-width: 640px) {
    div {
      padding: 0.5rem !important;
    }

    span:first-of-type {
      flex: 1;
      order: 1;
      margin-bottom: 0.5rem;
    }
    span:nth-child(2) {
      flex: unset;
      order: 3;
    }
    span:last-of-type {
      flex: 1;
      order: 2;
      text-align: right;
      margin-bottom: 0.5rem;
    }
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

<div class={serverMessage == true ? 'server' : ''}>
  <div>
    <span class="user">{user}:</span>
    <time>{timeStamp}</time>
  </div>
  <div>
    <span>{message}</span>
  </div>
</div>
