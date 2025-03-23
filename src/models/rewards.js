// Rewards data model
export const sampleRewards = [
  {
    id: 'reward1',
    name: 'Massage',
    pointsCost: 10,
    claimedBy: null,
    claimedAt: null
  },
  {
    id: 'reward2',
    name: 'Frukost på sängen',
    pointsCost: 5,
    claimedBy: null,
    claimedAt: null
  },
  {
    id: 'reward3',
    name: 'Välj film på filmkvällen',
    pointsCost: 3,
    claimedBy: null,
    claimedAt: null
  }
];

// Claim a reward
export const claimReward = (rewardId, userId, rewards) => {
  return rewards.map(reward => {
    if (reward.id === rewardId) {
      return {
        ...reward,
        claimedBy: userId,
        claimedAt: new Date().toISOString()
      };
    }
    return reward;
  });
}; 