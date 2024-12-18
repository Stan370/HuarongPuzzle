import { Devvit, useState } from '@devvit/public-api';
import { HuarongGame } from '../webroot/game.js';

// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage =
  | {
      type: 'initialData';
      data: { username: string; bestScore: number; level: number };
    }
  | {
      type: 'updateScore';
      data: { username: string; level: number; score: number };
    }
  | {
      type: 'getBestScore';
      data: { username: string; level: number };
    }
  | {
      type: 'bestScoreResponse';
      data: { score: number | null };
    };

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Webview Example',
  height: 'tall',
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });

    const [webviewVisible, setWebviewVisible] = useState(false);

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage('myWebView', {
        type: 'initialData',
        data: {
          username: username,
        },
      });
    };

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? '0%' : '100%'}
          alignment="middle center"
        >
          <text size="xlarge" weight="bold">
            Huarong Dao
          </text>
          <spacer />
          <vstack alignment="start middle">
            <hstack>
              <text size="medium">Username:</text>
              <text size="medium" weight="bold">
                {' '}
                {username ?? ''}
              </text>
            </hstack>
          </vstack>
          <spacer />
          <button onPress={onShowWebviewClick}>Launch App</button>
        </vstack>
        <vstack grow={webviewVisible} height={webviewVisible ? '100%' : '0%'}>
          <vstack border="thick" borderColor="black" height={webviewVisible ? '100%' : '0%'}>
            <webview
              id="myWebView"
              url="page.html"
              grow
              height={webviewVisible ? '100%' : '0%'}
              onMessage={async (message) => {
                const msg = message as WebViewMessage;
                if (msg.type === 'updateScore') {
                  const { username, level, score } = msg.data;
                  const key = `bestscore:${username}:level${level}`;
                  const currentBest = await context.redis.get(key);
                  
                  if (!currentBest || score < parseInt(currentBest)) {
                    await context.redis.set(key, score.toString());
                  }
                }
                
                if (msg.type === 'getBestScore') {
                  const { username, level } = msg.data;
                  const key = `bestscore:${username}:level${level}`;
                  const score = await context.redis.get(key);
                  
                  context.ui.webView.postMessage('myWebView', {
                    type: 'bestScoreResponse',
                    data: { score: score ? parseInt(score) : null }
                  });
                }
              }}
            />
            
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

Devvit.addMenuItem({
  label: 'Create New Devvit Post (with Klotski)',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Webview Example',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post);
  },
});

export default Devvit;
