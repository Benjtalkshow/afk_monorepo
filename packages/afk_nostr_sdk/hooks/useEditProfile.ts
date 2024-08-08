import {NDKUserProfile} from '@nostr-dev-kit/ndk';
import {useMutation} from '@tanstack/react-query';

// import {useNostrContext} from '../../context/NostrContext';
// import {useAuth} from '../../store/auth';
// import {useNostrContext} from '../context/NostrContext';
import {useNostrContext} from '../context/NostrContext';

import {useAuth} from '../store/auth';
export const useEditProfile = () => {
  const {ndk} = useNostrContext();
  const {publicKey} = useAuth();

  return useMutation({
    mutationKey: ['editProfile', ndk],
    mutationFn: async (data: NDKUserProfile) => {
      try {
        const user = ndk.getUser({pubkey: publicKey});
        await user.fetchProfile();

        if (!user.profile) {
          throw new Error('Profile not found');
        }

        user.profile = {...user.profile, ...data};

        return user.publish();
      } catch (error) {
        console.error('Error editing profile', error);
        throw error;
      }
    },
  });
};
