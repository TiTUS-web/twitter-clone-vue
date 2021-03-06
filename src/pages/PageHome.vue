<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            placeholder="What's happening ?"
            v-model="newTweetContent"
            class="new-tweet"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img
                  src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewTweet"
            unelevated
            rounded
            color="primary"
            label="Tweet"
            class="q-mb-lg"
            no-caps
            :disable="!newTweetContent"
          />
        </div>
      </div>

      <q-separator size="5px" color="grey-4" class="divider" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slowed"
          leave-active-class="animated fadeOut slowed"
        >
          <q-item v-for="tweet in tweets" :key="tweet.id" class="tweet q-py-md">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img
                  src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>TiTUS</strong>
                <span class="text-grey-7">
                  &nbsp; @titus__dev &bull;
                  <br class="lt-md" />
                  {{ relativeDate(tweet.date) || tweet.date }}
                </span>
              </q-item-label>
              <q-item-label class="tweet-content text-body1">
                {{ tweet.content }}
              </q-item-label>
              <div class="tweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="far fa-comment"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
                <q-btn
                  flat
                  round
                  size="sm"
                  @click="toggleLiked(tweet)"
                  :icon="tweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  :color="tweet.liked ? 'pink' : 'grey'"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                  @click="deleteTweet(tweet)"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { formatDistance } from "date-fns";
import db from "src/boot/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export default {
  name: "PageHome",
  data() {
    return {
      newTweetContent: "",
      tweets: [
        // {
        //   id: "ID1",
        //   content:
        //     "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo eligendi suscipit ad sunt veniam eius recusandae corporis veritatis. Est, eligendi.",
        //   date: 1636937397126,
        //   liked: false,
        // },
        // {
        //   id: "ID2",
        //   content:
        //     "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo eligendi suscipit ad sunt veniam eius recusandae corporis veritatis. Est, eligendi.",
        //   date: 1636937470223,
        //   liked: true,
        // },
      ],
    };
  },
  methods: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
    async deleteTweet(tweet) {
      await deleteDoc(doc(db, "tweets", tweet.id));
    },
    async addNewTweet() {
      let newTweet = {
        content: this.newTweetContent,
        date: Date.now(),
        liked: false,
      };

      // this.tweets.unshift(newTweet);
      const docRef = await addDoc(collection(db, "tweets"), newTweet);
      console.log("Document written with ID: ", docRef.id);

      this.newTweetContent = "";
    },
    async toggleLiked(tweet) {
      const toggleLikedRef = doc(db, "tweets", tweet.id);

      await updateDoc(toggleLikedRef, {
        liked: !tweet.liked,
      });
    },
  },
  mounted() {
    const q = query(collection(db, "tweets"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let tweetChange = change.doc.data();
        tweetChange.id = change.doc.id;
        if (change.type === "added") {
          console.log("New tweet: ", tweetChange);
          this.tweets.unshift(tweetChange);
        }
        if (change.type === "modified") {
          console.log("Modified tweet: ", tweetChange);
          let index = this.tweets.findIndex(
            (tweet) => tweet.id === tweetChange.id
          );
          Object.assign(this.tweets[index], tweetChange);
        }
        if (change.type === "removed") {
          console.log("Removed tweet: ", tweetChange);
          let index = this.tweets.findIndex(
            (tweet) => tweet.id === tweetChange.id
          );
          this.tweets.splice(index, 1);
        }
      });
    });
  },
};
</script>

<style lang="scss">
.new-tweet textarea {
  font-size: 19px;
  line-height: 1.4 !important;
}
.divider {
  border-top: 1px solid;
  border-bottom: 1px solid;
  border-color: $grey-4;
}

.tweet {
  &:not(:first-child) {
    border-top: 1px solid black rgba(0, 0, 0, 0.12);
  }

  &-content {
    white-space: pre-line;
  }

  &-icons {
    margin-left: -5px;
  }
}
</style>
