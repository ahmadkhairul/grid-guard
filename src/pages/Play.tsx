
import { useParams } from 'react-router-dom';
import { Game } from '@/components/game/Game';

const Play = () => {
    const { mapId } = useParams();
    return <Game mapId={mapId} />;
};

export default Play;
