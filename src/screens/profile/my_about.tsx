import Sentences from '@/components/utils/edit_sentences';
import Tags from '@/components/utils/edit_tags';
import { SERVER_ERROR } from '@/config/errors';
import { USER_URL } from '@/config/routes';
import patchHandler from '@/handlers/patch_handler';
import { Profile, User } from '@/types';
import isArrEdited from '@/utils/check_array_edited';
import Toaster from '@/utils/toaster';
import { Buildings, CalendarBlank, Certificate, PencilSimple } from '@phosphor-icons/react';
import moment from 'moment';
import React, { useState } from 'react';

interface Props {
  profile: Profile;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const About = ({ profile, setUser }: Props) => {
  const [school, setSchool] = useState(profile.school || '');
  const [degree, setDegree] = useState(profile.degree || '');
  const [yog, setYOG] = useState(profile.yearOfGraduation || 0);

  const [description, setDescription] = useState(profile.description || '');
  const [hobbies, setHobbies] = useState(profile.hobbies || []);
  const [areas, setAreas] = useState(profile.areasOfCollaboration || []);

  const [mutex, setMutex] = useState(false);

  const [clickedOnSchool, setClickedOnSchool] = useState(false);
  const [clickedOnDegree, setClickedOnDegree] = useState(false);
  const [clickedOnYOG, setClickedOnYOG] = useState(false);
  const [clickedOnDescription, setClickedOnDescription] = useState(false);
  const [clickedOnHobbies, setClickedOnHobbies] = useState(false);
  const [clickedOnAreas, setClickedOnAreas] = useState(false);

  const handleSubmit = async (field: string) => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating your Profile...');
    const formData = new FormData();

    if (field == 'school') formData.append('school', school);
    else if (field == 'degree') formData.append('degree', degree);
    else if (field == 'yog') formData.append('yog', String(yog));
    else if (field == 'description') formData.append('description', description.replace(/\n{3,}/g, '\n\n'));
    else if (field == 'hobbies') hobbies.forEach(hobby => formData.append('hobbies[]', hobby));
    else if (field == 'areas') areas.forEach(area => formData.append('areas[]', area));

    const URL = `${USER_URL}/me/profile`;

    const res = await patchHandler(URL, formData);

    if (res.statusCode === 200) {
      const profile = res.data.profile;
      setUser(prev => ({
        ...prev,
        profile,
      }));
      Toaster.stopLoad(toaster, 'Profile Updated', 1);

      if (field == 'school') setClickedOnSchool(false);
      else if (field == 'degree') setClickedOnDegree(false);
      else if (field == 'yog') setClickedOnYOG(false);
      else if (field == 'description') setClickedOnDescription(false);
      else if (field == 'hobbies') setClickedOnHobbies(false);
      else if (field == 'areas') setClickedOnAreas(false);
    } else if (res.statusCode == 413) {
      Toaster.stopLoad(toaster, 'Image too large', 0);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
    setMutex(false);
  };

  interface SaveBtnProps {
    setter: React.Dispatch<React.SetStateAction<boolean>>;
    field: string;
  }

  const SaveBtn = ({ setter, field }: SaveBtnProps) => {
    const checker = () => {
      if (field == 'school') return school == profile.school;
      else if (field == 'degree') return degree == profile.degree;
      else if (field == 'yog') return yog == profile.yearOfGraduation || yog < 1980;
      else if (field == 'description') return description == profile.description;
      else if (field == 'hobbies') return !isArrEdited(hobbies, profile.hobbies);
      else if (field == 'areas') return !isArrEdited(areas, profile.areasOfCollaboration);
      return true;
    };
    return (
      <div className="w-full flex text-sm justify-end gap-2 mt-2">
        <div
          onClick={() => setter(false)}
          className="border-[1px] border-primary_black flex-center rounded-full w-20 p-1 cursor-pointer"
        >
          Cancel
        </div>
        {checker() ? (
          <div className="bg-primary_black bg-opacity-50 text-white flex-center rounded-full w-16 p-1 cursor-default">
            Save
          </div>
        ) : (
          <div
            onClick={() => handleSubmit(field)}
            className="bg-primary_black text-white flex-center rounded-full w-16 p-1 cursor-pointer"
          >
            Save
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[640px] text-primary_black mx-auto flex flex-col gap-4 pb-8">
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex justify-between items-center flex-wrap gap-4">
          <div className="w-fit min-w-[80%] flex gap-2 items-center text-xl font-medium">
            <Buildings weight="bold" size={24} />

            {clickedOnSchool ? (
              <div className="w-full">
                <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                  College Name ({school.trim().length}/25)
                </div>
                <input
                  maxLength={25}
                  value={school}
                  onChange={el => setSchool(el.target.value)}
                  placeholder="Interact University"
                  className="w-full text-primary_black focus:outline-none border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-lg p-2 font-semibold bg-transparent"
                />
                <SaveBtn setter={setClickedOnSchool} field="school" />
              </div>
            ) : (
              <div
                onClick={() => setClickedOnSchool(true)}
                className={`w-fit relative group rounded-lg p-2 pr-10 ${
                  profile.school.trim() == '' ? 'bg-gray-100' : 'hover:bg-gray-100'
                } cursor-pointer transition-ease-300`}
              >
                <PencilSimple
                  className={`absolute ${
                    profile.school.trim() == '' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }  -translate-y-1/2 top-1/2 right-2 transition-ease-300`}
                />
                {profile.school.trim() == '' ? (
                  <div className="text-sm font-normal">Add College Name</div>
                ) : (
                  <div>{profile.school}</div>
                )}
              </div>
            )}
          </div>
          {profile.school != '' ? (
            <div className="flex gap-1 items-center">
              {clickedOnYOG ? (
                <div className="w-fit">
                  <div className="text-xs ml-1 font-medium uppercase text-gray-500">Graduation Year</div>
                  <input
                    value={yog}
                    type="number"
                    onChange={el => setYOG(Number(el.target.value))}
                    placeholder="2023"
                    className="w-fit text-primary_black focus:outline-none border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-lg p-2 font-semibold bg-transparent"
                  />
                  <SaveBtn setter={setClickedOnYOG} field="yog" />
                </div>
              ) : (
                <div
                  onClick={() => setClickedOnYOG(true)}
                  className={`w-fit relative group rounded-lg p-2 pl-8 ${
                    profile.yearOfGraduation == 0 ? 'bg-gray-100' : 'hover:bg-gray-100'
                  } cursor-pointer transition-ease-300`}
                >
                  <PencilSimple
                    className={`absolute ${
                      profile.yearOfGraduation == 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }  -translate-y-1/2 top-1/2 left-2 transition-ease-300`}
                  />
                  {profile.yearOfGraduation == 0 ? (
                    <div className="text-sm">Add Degree Completion Year</div>
                  ) : (
                    <div>{profile.yearOfGraduation}</div>
                  )}
                </div>
              )}

              <CalendarBlank weight="bold" size={20} />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="w-full flex gap-2 items-center text-lg">
          <Certificate weight="bold" size={24} />

          {clickedOnDegree ? (
            <div className="w-3/4">
              <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                Degree Name ({degree.trim().length}/25)
              </div>
              <input
                maxLength={25}
                value={degree}
                onChange={el => setDegree(el.target.value)}
                placeholder="Bachelors in Interacting"
                className="w-full text-primary_black focus:outline-none border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-lg p-2 font-semibold bg-transparent"
              />
              <SaveBtn setter={setClickedOnDegree} field="degree" />
            </div>
          ) : (
            <div
              onClick={() => setClickedOnDegree(true)}
              className={`w-fit relative group rounded-lg p-2 pr-10 ${
                profile.degree.trim() == '' ? 'bg-gray-100' : 'hover:bg-gray-100'
              } cursor-pointer transition-ease-300`}
            >
              <PencilSimple
                className={`absolute ${
                  profile.degree.trim() == '' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }  -translate-y-1/2 top-1/2 right-2 transition-ease-300`}
              />
              {profile.degree.trim() == '' ? (
                <div className="text-sm">Add Degree Name</div>
              ) : (
                <div>{profile.degree}</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-[1px] border-t-[1px] border-gray-400 border-dashed"></div>

      {clickedOnDescription ? (
        <div className="w-full">
          <div className="text-xs ml-1 font-medium uppercase text-gray-500">
            Descriptive Bio ({description.trim().length}/1500)
          </div>
          <textarea
            value={description}
            onChange={el => setDescription(el.target.value)}
            placeholder="add a professional bio"
            maxLength={1500}
            className="w-full min-h-[200px] max-h-[320px] focus:outline-none text-primary_black border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-2 text-sm bg-transparent"
          />
          <SaveBtn setter={setClickedOnDescription} field="description" />
        </div>
      ) : (
        <div
          onClick={() => setClickedOnDescription(true)}
          className={`w-full relative group rounded-lg flex-center p-4 ${
            profile.description.trim() == '' ? 'bg-gray-100' : 'hover:bg-gray-100'
          } cursor-pointer transition-ease-300`}
        >
          <PencilSimple
            className={`absolute opacity-0 ${
              profile.description.trim() == '' ? 'opacity-100' : 'group-hover:opacity-100'
            } top-2 right-2 transition-ease-300`}
          />
          {profile.description.trim() == '' ? (
            <div className="">Click here to add a Descriptive Bio!</div>
          ) : (
            <div className={`whitespace-pre-wrap max-md:text-sm cursor-pointer`}>{profile.description}</div>
          )}
        </div>
      )}
      <div className="w-full h-[1px] border-t-[1px] border-gray-400 border-dashed"></div>
      <div className="w-full flex flex-col gap-2">
        {clickedOnAreas ? (
          <div className="w-full flex flex-col gap-2">
            <div className="text-xs ml-1 font-medium uppercase">
              Preferred Areas of Collaboration ({areas.length || 0}/10)
            </div>
            <Tags tags={areas} setTags={setAreas} maxTags={10} />
            <SaveBtn setter={setClickedOnAreas} field="areas" />
          </div>
        ) : (
          <>
            <div className="text-sm font-medium uppercase">Preferred Areas of Collaboration</div>

            <div
              onClick={() => setClickedOnAreas(true)}
              className={`w-full relative group rounded-lg flex-center p-4 ${
                !profile.areasOfCollaboration || profile.areasOfCollaboration?.length == 0
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
              } cursor-pointer transition-ease-300`}
            >
              <PencilSimple
                className={`absolute opacity-0 ${
                  !profile.areasOfCollaboration || profile.areasOfCollaboration?.length == 0
                    ? 'opacity-100'
                    : 'group-hover:opacity-100'
                } top-2 right-2 transition-ease-300`}
              />
              {!profile.areasOfCollaboration || profile.areasOfCollaboration.length == 0 ? (
                <div className="">Click here to edit!</div>
              ) : (
                <div className="w-full flex flex-wrap gap-4">
                  {profile.areasOfCollaboration.map((el, i) => (
                    <div
                      key={i}
                      className="border-gray-500 border-[1px] border-dashed p-2 text-sm rounded-lg flex-center"
                    >
                      {el}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* <div className="w-full h-[1px] border-t-[1px] border-gray-400 border-dashed"></div>
      <div className="w-full flex flex-col gap-2">
        <div className="text-sm font-medium uppercase">Achievements</div>
      </div> */}

      <div className="w-full h-[1px] border-t-[1px] border-gray-400 border-dashed"></div>

      {clickedOnHobbies ? (
        <div className="w-full flex flex-col gap-2">
          <div className="text-sm font-medium uppercase">Hobbies and Interest ({hobbies.length || 0}/5)</div>
          <Sentences sentences={hobbies} setSentences={setHobbies} maxSentences={5} />
          <SaveBtn setter={setClickedOnHobbies} field="hobbies" />
        </div>
      ) : (
        <div onClick={() => setClickedOnHobbies(true)} className="w-full flex flex-col gap-2">
          <div className="w-full flex justify-between group cursor-pointer">
            <div className="text-sm font-medium uppercase">Hobbies and Interest</div>
            <PencilSimple className={`opacity-0 group-hover:opacity-100 transition-ease-300`} />
          </div>

          {!profile.hobbies || profile.hobbies.length == 0 ? (
            <div className="text-center py-4 bg-gray-100 rounded-lg cursor-pointer">Click here to edit!</div>
          ) : (
            <div className="w-full flex flex-wrap">
              {profile.hobbies.map((el, i) => (
                <div
                  key={i}
                  className="text-sm hover:bg-white p-3 py-2 rounded-lg cursor-pointer hover:scale-105 transition-ease-500"
                >
                  {el}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default About;
