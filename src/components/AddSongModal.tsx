'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

type AddSongModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (songData: any) => void;
};

export default function AddSongModal({ isOpen, onClose, onSubmit }: AddSongModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    youtube_url: '',
    key: '',
    tempo: '',
    difficulty: 'Easy',
    chord_progression: [] as string[],
    tabs: '',
    notes: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    try {
      // If using YouTube URL, we'll analyze it here
      if (!manualEntry && formData.youtube_url) {
        // TODO: Implement AI analysis
        // For now, just submit the form data
        await onSubmit({
          ...formData,
          tempo: parseInt(formData.tempo) || 0,
          chord_progression: formData.chord_progression.length ? 
            formData.chord_progression : 
            ['To be analyzed']
        });
      } else {
        // Manual entry
        await onSubmit({
          ...formData,
          tempo: parseInt(formData.tempo) || 0,
          chord_progression: formData.chord_progression.toString().split(',').map(c => c.trim())
        });
      }
      onClose();
    } catch (error) {
      console.error('Error submitting song:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-10 pb-5 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-white mb-4">
                      Add New Song
                    </Dialog.Title>

                    <div className="mb-4">
                      <label className="flex items-center text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={manualEntry}
                          onChange={(e) => setManualEntry(e.target.checked)}
                          className="mr-2"
                        />
                        Manual Entry Mode
                      </label>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!manualEntry && (
                        <div>
                          <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-300">
                            YouTube URL
                          </label>
                          <input
                            type="text"
                            id="youtube_url"
                            name="youtube_url"
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.youtube_url}
                            onChange={handleChange}
                            placeholder="https://youtube.com/..."
                          />
                        </div>
                      )}

                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                          Song Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          required
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={formData.title}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="artist" className="block text-sm font-medium text-gray-300">
                          Artist
                        </label>
                        <input
                          type="text"
                          id="artist"
                          name="artist"
                          required
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={formData.artist}
                          onChange={handleChange}
                        />
                      </div>

                      {manualEntry && (
                        <>
                          <div>
                            <label htmlFor="key" className="block text-sm font-medium text-gray-300">
                              Key
                            </label>
                            <input
                              type="text"
                              id="key"
                              name="key"
                              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              value={formData.key}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <label htmlFor="tempo" className="block text-sm font-medium text-gray-300">
                              Tempo (BPM)
                            </label>
                            <input
                              type="number"
                              id="tempo"
                              name="tempo"
                              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              value={formData.tempo}
                              onChange={handleChange}
                            />
                          </div>

                          <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300">
                              Difficulty
                            </label>
                            <select
                              id="difficulty"
                              name="difficulty"
                              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              value={formData.difficulty}
                              onChange={handleChange}
                            >
                              <option>Easy</option>
                              <option>Medium</option>
                              <option>Hard</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="chord_progression" className="block text-sm font-medium text-gray-300">
                              Chord Progression (comma-separated)
                            </label>
                            <input
                              type="text"
                              id="chord_progression"
                              name="chord_progression"
                              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              value={formData.chord_progression}
                              onChange={handleChange}
                              placeholder="Am, G, F, E"
                            />
                          </div>

                          <div>
                            <label htmlFor="tabs" className="block text-sm font-medium text-gray-300">
                              Tabs
                            </label>
                            <textarea
                              id="tabs"
                              name="tabs"
                              rows={4}
                              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              value={formData.tabs}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={2}
                          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={formData.notes}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isAnalyzing}
                          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                        >
                          {isAnalyzing ? 'Analyzing...' : (manualEntry ? 'Add Song' : 'Analyze & Add')}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 hover:bg-gray-600 sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}