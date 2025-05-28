import { AvatarQuality, ElevenLabsModel, StartAvatarRequest } from '@heygen/streaming-avatar';
import { AVATARS, KNOWLEDGES, LANGUAGE_LIST, QUALITIES } from '@/data/avatars';
import Button from '@/components/Button';

interface AvatarConfigProps {
  onConfigChange: (config: StartAvatarRequest) => void;
  config: StartAvatarRequest;
  startSession: () => void;
}

export default function AvatarConfig({ config, onConfigChange, startSession }: AvatarConfigProps) {
  const onChange = <T extends keyof StartAvatarRequest>(key: T, value: StartAvatarRequest[T]) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="bg-[var(--dark)] w-200 h-150 rounded-xl p-4 flex flex-col gap-5 justify-center items-center">
      <div className="w-[80%] flex flex-col gap-5">
        {/* Avatar Select */}
        <div>
          <label htmlFor="avatar-select" className="block mb-1 text-sm font-medium text-white">
            Выберите аватар
          </label>
          <select
            id="avatar-select"
            className="bg-[var(--black)] text-[var(--white)] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white w-full"
            value={config.avatarName}
            onChange={(e) => onChange('avatarName', e.target.value)}
          >
            <option disabled value="">
              Выберите аватар
            </option>
            {AVATARS.map((avatar) => (
              <option key={avatar.avatar_id} value={avatar.avatar_id}>
                {avatar.name}
              </option>
            ))}
          </select>
        </div>

        {/* Knowledge Select */}
        <div>
          <label htmlFor="knowledge-select" className="block mb-1 text-sm font-medium text-white">
            Выберите базу знаний
          </label>
          <select
            id="knowledge-select"
            className="bg-[var(--black)] text-[var(--white)] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white w-full"
            value={config.knowledgeId}
            onChange={(e) => onChange('knowledgeId', e.target.value)}
          >
            <option disabled value="">
              Выберите базу знаний
            </option>
            {KNOWLEDGES.map((knowledge) => (
              <option key={knowledge.key} value={knowledge.value}>
                {knowledge.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language Select */}
        <div>
          <label htmlFor="language-select" className="block mb-1 text-sm font-medium text-white">
            Выберите язык
          </label>
          <select
            id="language-select"
            className="bg-[var(--black)] text-[var(--white)] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white w-full"
            value={config.language}
            onChange={(e) => onChange('language', e.target.value)}
          >
            <option disabled value="">
              Выберите язык
            </option>
            {LANGUAGE_LIST.map((lang) => (
              <option key={lang.key} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quality Select */}
        <div>
          <label htmlFor="quality-select" className="block mb-1 text-sm font-medium text-white">
            Качество аватара
          </label>
          <select
            id="quality-select"
            className="bg-[var(--black)] text-[var(--white)] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white w-full"
            value={config.quality}
            onChange={(e) => onChange('quality', e.target.value as AvatarQuality)}
          >
            <option disabled value="">
              Выберите качество
            </option>
            {QUALITIES.map((quality) => (
              <option key={quality.key} value={quality.key}>
                {quality.label}
              </option>
            ))}
          </select>
        </div>

        {/* TTS Model Select */}
        <div>
          <label htmlFor="quality-select" className="block mb-1 text-sm font-medium text-white">
            Модель озвучки
          </label>
          <select
            id="quality-select"
            className="bg-[var(--black)] text-[var(--white)] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white w-full"
            value={config.voice?.model}
            onChange={
            (e) => onChange("voice", { ...config.voice, model: e.target.value as ElevenLabsModel })
          }
          >
            <option disabled value="">
              Выберите модель
            </option>
            {Object.values(ElevenLabsModel).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="flex justify-center">
        <Button onClick={startSession}>Начать сессию</Button>
      </div>
    </div>
  );
}
