import { YStack } from 'tamagui';

import { TripCard } from '@/components/activities/trips/TripCard';
import { Trip } from '@/components/activities/types';

type TripsListProps = {
    trips: Trip[];
};

export function TripsList({ trips }: TripsListProps) {
    return (
        <YStack marginBottom={20}>
            {trips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
            ))}
        </YStack>
    );
}